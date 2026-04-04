const nodemailer = require('nodemailer');

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'ilovesoftoi@gmail.com',
    pass: process.env.EMAIL_PASS, // Gmail App Password (not regular password)
  },
});

// Send contact form email
async function sendContactEmail({ name, email, subject, message }) {
  const mailOptions = {
    from: `"Softoi Contact Form" <${process.env.EMAIL_USER || 'ilovesoftoi@gmail.com'}>`,
    to: 'ilovesoftoi@gmail.com',
    replyTo: email,
    subject: `[Contact Form] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff5f8; border-radius: 12px;">
        <h2 style="color: #C44569; margin-bottom: 20px;">New Contact Form Message</h2>
        <div style="background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 8px 0;"><strong>From:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background: #fff; padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
          <p style="margin: 0; line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

// Send order confirmation email to customer
async function sendOrderConfirmation(order) {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f0e0e8;">
        <strong>${item.name}</strong><br>
        <span style="color: #9E7B6C; font-size: 0.875rem;">Qty: ${item.quantity} × ₹${item.price}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #f0e0e8; text-align: right; font-weight: 700;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Softoi" <${process.env.EMAIL_USER || 'ilovesoftoi@gmail.com'}>`,
    to: order.shipping.email,
    subject: `Order Confirmed #${order.orderId} 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #f8c8dc;">
        <div style="background: linear-gradient(135deg, #C44569, #E8607B); padding: 32px; text-align: center; color: #fff;">
          <h1 style="margin: 0 0 8px 0; font-size: 1.75rem;">Order Confirmed! 🎉</h1>
          <p style="margin: 0; opacity: 0.9;">Thank you for shopping with Softtoi</p>
        </div>
        
        <div style="padding: 32px;">
          <div style="background: #fff5f8; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; color: #9E7B6C; font-size: 0.875rem;">Order ID</p>
            <p style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #C44569;">#${order.orderId}</p>
          </div>

          <h3 style="color: #7A5C4E; margin-bottom: 12px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            ${itemsHtml}
            <tr>
              <td style="padding: 12px; font-weight: 600;">Subtotal</td>
              <td style="padding: 12px; text-align: right;">₹${order.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: 600;">Shipping</td>
              <td style="padding: 12px; text-align: right;">${order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</td>
            </tr>
            <tr style="background: #fff5f8;">
              <td style="padding: 12px; font-weight: 700; font-size: 1.1rem;">Total</td>
              <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 1.1rem; color: #C44569;">₹${order.total.toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <h3 style="color: #7A5C4E; margin-bottom: 12px;">Delivery Address</h3>
          <div style="background: #fff6ec; padding: 16px; border-radius: 8px; line-height: 1.6; color: #7A5C4E;">
            <strong>${order.shipping.firstName} ${order.shipping.lastName}</strong><br>
            ${order.shipping.address}<br>
            ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.zipCode}<br>
            ${order.shipping.phone}
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #dcfce7; border-radius: 8px; border-left: 4px solid #16a34a;">
            <p style="margin: 0; color: #15803d; font-weight: 600;">✓ Payment Method: Cash on Delivery (COD)</p>
          </div>

          <p style="margin-top: 24px; color: #9E7B6C; line-height: 1.6; font-size: 0.875rem;">
            We'll send you another email once your order ships. If you have any questions, reply to this email or contact us at <a href="mailto:ilovesoftoi@gmail.com" style="color: #C44569;">ilovesoftoi@gmail.com</a>
          </p>
        </div>

        <div style="background: #fff5f8; padding: 20px; text-align: center; color: #9E7B6C; font-size: 0.8rem;">
          <p style="margin: 0;">Made with ❤️ by Softoi | Handmade with Love</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail, sendOrderConfirmation };
