require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Admin = require('./models/Admin');

const img = (seed) => `https://picsum.photos/seed/${seed}/600/600`;

// Beautiful curated Unsplash photos per category
const KC = (id, w=600, h=600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=82`
const ST = (id, w=600, h=600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=82`
const FL = (id, w=600, h=600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=82`

const categories = [
  {
    name: 'Keychains',
    slug: 'keychains',
    description: 'Adorable handcrafted keychains that add a personal touch to your everyday carry.',
    image: KC('1515562141207-7a88fb7ce338', 600, 750),
  },
  {
    name: 'Soft Toys',
    slug: 'soft-toys',
    description: 'Irresistibly soft and cuddly handmade plush companions for all ages.',
    image: ST('1563396983906-b3795482a59a', 600, 750),
  },
  {
    name: 'Flowers',
    slug: 'flowers',
    description: 'Beautifully crafted floral arrangements that bring nature\'s beauty into your home.',
    image: FL('1490750967868-88df5691cc43', 600, 750),
  },
];

const products = [
  // Keychains
  {
    name: 'Rose Garden Keychain',
    slug: 'rose-garden-keychain',
    description: 'A delicately handcrafted keychain featuring miniature rose blooms in soft blush and ivory tones. Each petal is individually shaped with care, making every piece truly unique. Perfect as a gift or a charming addition to your own keyring.',
    details: ['Material: Air-dry clay and premium wire', 'Size: Approximately 8cm length', 'Comes in a gift-ready box', 'Handcrafted with artisan care', 'Available in multiple color variations'],
    price: 299, originalPrice: 399, category: 'keychains',
    image: KC('1515562141207-7a88fb7ce338'), badge: 'Bestseller', rating: 4.8, reviewCount: 124, featured: true,
  },
  {
    name: 'Crystal Heart Charm',
    slug: 'crystal-heart-charm',
    description: 'A sparkling crystal heart keychain that catches the light beautifully wherever you go. Crafted with genuine Swarovski-style crystals and polished silver-tone hardware. A timeless piece that makes for the perfect romantic gift.',
    details: ['Premium crystal components', 'Tarnish-resistant metal hardware', 'Size: 6cm length', 'Gift ribbon included', 'Customizable with initials on request'],
    price: 249, category: 'keychains',
    image: KC('1605100804763-247f67b3557e'), badge: null, rating: 4.6, reviewCount: 89, featured: false,
  },
  {
    name: 'Butterfly Dream Keychain',
    slug: 'butterfly-dream-keychain',
    description: 'A whimsical butterfly keychain handpainted with iridescent colors that shimmer in the sunlight. Each butterfly wing features intricate hand-painted details that make it a wearable work of art. Inspired by the freedom and beauty of nature.',
    details: ['Hand-painted resin butterfly', 'UV-resistant coating', 'Size: 9cm including chain', 'Eco-friendly materials', 'Each piece is one-of-a-kind'],
    price: 329, originalPrice: 449, category: 'keychains',
    image: KC('1576871337632-b9aef4c17ab9'), badge: 'New', rating: 4.9, reviewCount: 56, featured: true,
  },
  {
    name: 'Pearl Bead Keychain',
    slug: 'pearl-bead-keychain',
    description: 'Elegant pearl bead keychain strung on durable silk thread with a gold lobster clasp. The lustrous faux pearls give a sophisticated look that pairs beautifully with any bag or key set. Simple, chic, and timeless.',
    details: ['High-quality faux pearl beads', 'Gold-tone lobster clasp', 'Size: 10cm length', 'Silk threading for durability', 'Easy to add to existing keyring'],
    price: 199, category: 'keychains',
    image: KC('1617005082133-548c4dd27f35'), badge: null, rating: 4.5, reviewCount: 43, featured: false,
  },
  {
    name: 'Floral Monogram Keychain',
    slug: 'floral-monogram-keychain',
    description: 'A personalized floral monogram keychain that spells out your initial in a bouquet of tiny handmade flowers. The perfect combination of personalization and artistry, crafted to order for every customer. Makes a truly thoughtful and unique gift.',
    details: ['Personalized with your chosen letter', 'Handcrafted polymer clay flowers', 'Size: 7cm x 4cm', 'Allow 3-5 days for customization', 'Comes with a personalized gift card'],
    price: 349, category: 'keychains',
    image: KC('1518621736915-f3b1c2b0f6ca'), badge: 'Customizable', rating: 4.7, reviewCount: 78, featured: false,
  },
  {
    name: 'Vintage Locket Keychain',
    slug: 'vintage-locket-keychain',
    description: 'A charming vintage-style locket keychain that opens to reveal a tiny space for a cherished photo or note. Finished with an antique gold patina and adorned with delicate floral engravings. A nostalgic keepsake you\'ll treasure forever.',
    details: ['Opens to hold a small photo (1.5cm x 1.5cm)', 'Antique gold-tone finish', 'Intricate floral engraving', 'Comes in a velvet pouch', 'Size: 7cm total length'],
    price: 399, category: 'keychains',
    image: KC('1515562141207-7a88fb7ce338'), badge: null, rating: 4.8, reviewCount: 32, featured: true,
  },
  // Soft Toys
  {
    name: 'Teddy Bear Plush',
    slug: 'teddy-bear-plush',
    description: 'An irresistibly soft handmade teddy bear crafted from premium plush fabric that is gentle on all skin types. Filled with hypoallergenic polyfill stuffing, this bear is safe for children of all ages. A classic companion that will be loved for years to come.',
    details: ['Premium ultra-soft plush fabric', 'Hypoallergenic polyfill stuffing', 'Size: 30cm seated height', 'Machine washable at 30°C', 'Safety tested for children aged 0+'],
    price: 799, originalPrice: 999, category: 'soft-toys',
    image: ST('1563396983906-b3795482a59a'), badge: 'Bestseller', rating: 4.9, reviewCount: 256, featured: true,
  },
  {
    name: 'Bunny Snuggler',
    slug: 'bunny-snuggler',
    description: 'A delightful handmade bunny with extra-long floppy ears and the softest imaginable fur you\'ll ever feel. Dressed in a tiny embroidered outfit that is sewn with love and attention to detail. This little bunny will become your child\'s most treasured bedtime companion.',
    details: ['Extra-long floppy ears for extra hugs', 'Embroidered facial features (no loose parts)', 'Size: 28cm standing height', 'Removable outfit for washing', 'Comes with a birth certificate and name'],
    price: 649, category: 'soft-toys',
    image: ST('1582562124811-b09e24e6b7e1'), badge: 'Popular', rating: 4.7, reviewCount: 189, featured: true,
  },
  {
    name: 'Kitty Cuddle Friend',
    slug: 'kitty-cuddle-friend',
    description: 'A perfectly adorable handmade kitty cat with sweet embroidered eyes and the most cuddleable form you can imagine. Made with premium velboa fabric for an unbelievably soft feel against the skin. This kitty comes in a variety of color combinations to suit every preference.',
    details: ['Velboa ultra-soft fabric', 'Embroidered nose and whiskers', 'Size: 25cm seated height', 'Available in 4 color options', 'CE certified safe for all ages'],
    price: 599, category: 'soft-toys',
    image: ST('1553361898-a8258344b7b3'), badge: null, rating: 4.6, reviewCount: 98, featured: false,
  },
  {
    name: 'Mini Elephant',
    slug: 'mini-elephant',
    description: 'A charming miniature elephant plush with big expressive eyes and a cheerful personality stitched into every seam. This compact-sized companion is perfect for travel, gifting, or decorating a nursery. Made with non-toxic, child-safe materials throughout.',
    details: ['Compact 20cm size, perfect for travel', 'Big embroidered eyes and a smile', 'Non-toxic, child-safe dyes', 'Weighted base for stable sitting', 'Comes in a cute gift box'],
    price: 449, category: 'soft-toys',
    image: ST('1559591937-abc29070a93e'), badge: 'Cute', rating: 4.8, reviewCount: 67, featured: false,
  },
  {
    name: 'Puppy Love Plush',
    slug: 'puppy-love-plush',
    description: 'A floppy-eared puppy plush that is guaranteed to steal your heart the moment you hold it. The handmade construction ensures each puppy has its own unique character and charm. A wonderful companion for children and adults who are dog lovers at heart.',
    details: ['Floppy ears and a waggy tail', 'Super soft minky fabric', 'Size: 32cm including tail', 'Hand-stitched details throughout', 'Machine washable'],
    price: 699, originalPrice: 849, category: 'soft-toys',
    image: ST('1527075168201-48fca21e36ff'), badge: null, rating: 4.9, reviewCount: 142, featured: false,
  },
  {
    name: 'Unicorn Dreams',
    slug: 'unicorn-dreams',
    description: 'A magical handmade unicorn plush complete with a shimmery rainbow mane, a sparkly golden horn, and starry eyes that radiate enchantment. This whimsical creature is crafted with premium iridescent fabrics and filled with the softest stuffing imaginable. Every child deserves a little magic.',
    details: ['Shimmery iridescent fabric body', 'Glitter-detailed golden horn', 'Fluffy rainbow mane and tail', 'Size: 35cm seated height', 'Comes in a magical gift bag with stickers'],
    price: 899, category: 'soft-toys',
    image: ST('1558618666-fcd25c85cd64'), badge: 'Magical', rating: 4.8, reviewCount: 203, featured: true,
  },
  // Flowers
  {
    name: 'Rose Bouquet',
    slug: 'rose-bouquet',
    description: 'A stunning handcrafted rose bouquet featuring 12 perfectly formed roses in romantic red and blush tones. Each petal is shaped by hand using premium crepe paper and coated with a light sealant for lasting beauty. This bouquet will never wilt and serves as a permanent reminder of love.',
    details: ['12 handcrafted paper roses', 'Never-wilt crepe paper construction', 'Wrapped in elegant kraft paper', 'Ribbon tie included', 'Lasts forever with minimal care'],
    price: 999, originalPrice: 1299, category: 'flowers',
    image: FL('1490750967868-88df5691cc43'), badge: 'Bestseller', rating: 4.9, reviewCount: 312, featured: true,
  },
  {
    name: 'Lavender Bundle',
    slug: 'lavender-bundle',
    description: 'A serene bundle of handcrafted lavender stems tied with a beautiful linen ribbon, designed to bring calm and elegance to any space. Made from high-quality dried lavender imported from Provence, France, with a genuine fragrance that lasts for months. The perfect aromatherapy and decorative piece.',
    details: ['Genuine dried Provençe lavender', 'Tied with natural linen ribbon', 'Bundle contains ~50 stems', 'Fragrance lasts 6-12 months', 'Natural moth repellent properties'],
    price: 599, category: 'flowers',
    image: FL('1501004318641-b39e6451bec6'), badge: 'Aromatic', rating: 4.7, reviewCount: 87, featured: false,
  },
  {
    name: 'Sunflower Basket',
    slug: 'sunflower-basket',
    description: 'A bright and cheerful arrangement of handcrafted sunflowers in a rustic woven basket that radiates positivity and warmth. Each sunflower is lovingly made from fabric and wire, capturing the golden beauty of real sunflowers without the upkeep. A perfect housewarming or birthday gift.',
    details: ['6 handcrafted fabric sunflowers', 'Rustic woven basket included', 'Basket size: 20cm x 15cm', 'Arrangement height: 40cm', 'UV-resistant fabric for lasting color'],
    price: 849, category: 'flowers',
    image: FL('1597848212624-a19eb35e2651'), badge: null, rating: 4.6, reviewCount: 45, featured: false,
  },
  {
    name: 'Cherry Blossom Branch',
    slug: 'cherry-blossom-branch',
    description: 'An exquisite handcrafted cherry blossom branch featuring hundreds of tiny blush-pink blooms that create an ethereal, dreamlike display. Made from wire and premium fabric, each branch is individually shaped to mimic the graceful form of a real sakura tree. A true statement piece for any interior.',
    details: ['Wire-and-fabric construction', 'Over 200 individual blossoms', 'Branch length: 80cm', 'Vase-ready stem base', 'Comes in a protective box'],
    price: 1199, originalPrice: 1499, category: 'flowers',
    image: FL('1490750967868-88df5691cc43'), badge: 'Premium', rating: 4.9, reviewCount: 156, featured: true,
  },
  {
    name: 'Tulip Garden Box',
    slug: 'tulip-garden-box',
    description: 'A delightful handcrafted arrangement of colorful tulips nestled in a painted wooden box garden, bringing the freshness of spring indoors all year round. Each tulip is individually crafted from satin ribbon and wire, with realistic ruffled petals. A cheerful and long-lasting decorative piece.',
    details: ['8 satin ribbon tulips', 'Painted wood display box', 'Box dimensions: 25cm x 15cm x 10cm', 'Available in spring or pastel palette', 'Dust with a soft cloth to maintain'],
    price: 749, category: 'flowers',
    image: FL('1487530811176-3780de880c2d'), badge: null, rating: 4.5, reviewCount: 34, featured: false,
  },
  {
    name: 'Mixed Wildflower Vase',
    slug: 'mixed-wildflower-vase',
    description: 'A breathtaking mixed wildflower arrangement in a hand-painted ceramic vase, capturing the spontaneous beauty of a summer meadow. Features a curated mix of handcrafted foxgloves, daisies, poppies, and baby\'s breath in a harmonious palette. Each vase is painted by hand, making it a truly one-of-a-kind heirloom.',
    details: ['15+ individual handcrafted wildflowers', 'Hand-painted ceramic vase included', 'Vase height: 20cm', 'Arrangement height: 45cm', 'Each vase is uniquely painted'],
    price: 1399, category: 'flowers',
    image: FL('1561136594-7f68f4c20276'), badge: 'Artisan', rating: 4.8, reviewCount: 198, featured: false,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      Admin.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    await Category.insertMany(categories);
    console.log('Categories seeded');

    await Product.insertMany(products);
    console.log('Products seeded');

    const hashedPassword = await bcrypt.hash('admin123', 12);
    await Admin.create({ username: 'admin', password: hashedPassword });
    console.log('Admin user created (username: admin, password: admin123)');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
