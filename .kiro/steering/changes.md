# Softtoi — Custom Changes Log

This file tracks all custom changes made to the codebase. If a `git pull` discards any of these, reapply them using this guide.

---

## 1. Animated Brand Strip → Logo Marquee (`src/pages/Home.jsx` + `src/index.css`)

**What:** Replaced the emoji text strip with a smooth infinite CSS marquee using logo images from `public/strip_logos/`.

**`src/index.css`** — add before `/* Gradient text */`:
```css
/* Marquee strip */
@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-outer {
  overflow: hidden;
  width: 100%;
}
.marquee-track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: marquee 18s linear infinite;
  will-change: transform;
}
.marquee-track:hover {
  animation-play-state: paused;
}
```

**`src/pages/Home.jsx`** — replace the `{/* ═══ BRAND STRIP ═══ */}` section with:
```jsx
{/* ═══ BRAND STRIP — logo marquee ═══ */}
<section style={{
  background: '#fff8f9',
  borderTop: '1px solid rgba(196,69,105,0.1)',
  borderBottom: '1px solid rgba(196,69,105,0.1)',
  padding: '20px 0',
}}>
  <div className="marquee-outer">
    <div className="marquee-track">
      {[...Array(4)].map((_, dupIdx) => (
        <div key={dupIdx} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {[
            '/strip_logos/handmade.png',
            '/strip_logos/gift.png',
            '/strip_logos/eco.png',
            '/strip_logos/fast.png',
            '/strip_logos/sustainable.png',
            '/strip_logos/image.png',
          ].map((src) => (
            <div
              key={src + dupIdx}
              style={{ padding: '0 44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <img src={src} alt="" style={{ height: 70, width: 'auto', objectFit: 'contain', display: 'block' }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 2. New Arrivals Slider replacing Featured Products (`src/pages/Home.jsx`)

**What:** The "Featured Products" section now shows a coverflow-style auto-playing draggable slider instead of a grid. Fetches `/products?sort=newest&limit=8`.

- `NewArrivalsSlider` component added above `export default function Home()`
- State: `newArrivals` added alongside `featured` and `categories`
- API call: `api.get('/products?sort=newest&limit=8')` added to the `Promise.all`
- Featured Products section renders `<NewArrivalsSlider products={newArrivals.length > 0 ? newArrivals : featured} />`

---

## 3. Backend: `sort=newest` + `limit` support (`lib/routes/products.js`)

**What:** Added `newest` sort option and `limit` query param.

```js
else if (sort === 'newest') sortOption.createdAt = -1;
// ...
const limit = parseInt(req.query.limit) || 0;
const products = await Product.find(query).sort(sortOption).limit(limit)...
```

---

## 4. Backend: Category POST route (`lib/routes/categories.js`)

**What:** Added admin-protected POST endpoint to create new categories.

```js
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const category = new Category({ name, slug, description, image });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
```

---

## 5. Admin Products — Featured checkbox + Custom Category (`src/pages/admin/AdminProducts.jsx`)

**What:**
- Removed hardcoded `CATS` array; categories now loaded from `/categories` API
- Category dropdown has `+ Create custom category…` option at the bottom
- Selecting it shows an inline input to type a name and POST to `/categories`
- "In Stock" and "Featured" checkboxes replaced with styled toggle cards
- Featured card shows a star icon and "Show on homepage" subtitle

Key state added: `categories`, `customCatName`, `creatingCat`
Key function added: `handleCreateCategory`

---

## 6. Buy Now button on ProductCard (`src/components/ProductCard.jsx`)

**What:** Added `handleBuyNow` — adds product to cart and navigates to `/checkout`. Buttons are in a full-width `grid` (2 equal columns) below the price to prevent cropping.

```jsx
const handleBuyNow = (e) => {
  e.preventDefault(); e.stopPropagation()
  if (!isCustomerAuth) { addToast('Please log in first to buy', 'info'); navigate('/login'); return }
  addToCart(product)
  navigate('/checkout')
}
```

Bottom of card info section:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
  <button onClick={handleAddToCart}>Add</button>
  <button onClick={handleBuyNow}>Buy Now</button>
</div>
```

---

## 7. Buy Now button on ProductDetail (`src/pages/ProductDetail.jsx`)

**What:** Added `handleBuyNow` (respects qty selector) and a "Buy Now" `btn-primary` button alongside "Add to Cart" (`btn-secondary`) in the CTAs row.

```jsx
const handleBuyNow = () => {
  if (!isCustomerAuth) { addToast('Please log in first to buy', 'info'); navigate('/login'); return }
  addToCart(product, qty)
  navigate('/checkout')
}
```

---

## 8. Logo files location

All strip logos are in `public/strip_logos/`:
- `handmade.png`, `gift.png`, `eco.png`, `fast.png`, `sustainable.png`, `image.png`

---

## 9. Product Variant System

**What:** Products can be linked as variants (e.g. different colors) using a shared `variantGroup` ID.

**Models updated:** `lib/models/Product.js` and `api/_lib/models/Product.js` — added:
```js
variantGroup: { type: String, default: null },
variantLabel: { type: String, default: null },
```

**Backend:** `lib/routes/products.js` GET `/:id` now returns `variants` array with sibling products.

**Admin:** `src/pages/admin/AdminProducts.jsx` — EMPTY constant and edit form include `variantGroup` and `variantLabel` fields. A "🎨 Variant Linking" section appears at the bottom of the product form.

**Frontend:** `src/pages/ProductDetail.jsx` — shows variant pills above the quantity selector when `product.variants.length > 1`. Each pill shows the variant's thumbnail + label and navigates to that product on click.

**Usage:** Set same `variantGroup` ID (e.g. `rose-keychain`) on all variant products. Set different `variantLabel` (e.g. `Red`, `Pink`) on each.
