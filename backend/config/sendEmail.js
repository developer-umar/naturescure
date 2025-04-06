const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOrderConfirmation = async ({ to, orderId, items, totalAmount  }) => {
    const productRows = items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price}</td>
        </tr>
      `).join('');

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Nature’s Cure" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Order Confirmed #${orderId}`,
        html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dwrphjdly/image/upload/v1743921186/Logo_kje7du.jpg" alt="Logo" style="width: 40px; height: 40px; border-radius: 50%;" />
          <div style="display: flex; align-items: baseline; gap: 4px;">
            <span style="font-size: 24px; font-weight: bold; font-style: italic; color: #15803d;">N</span>
            <span style="font-size: 20px; font-weight: 600; color: #1f2937;">ature's</span>
            <span style="font-size: 24px; font-weight: bold; font-style: italic; color: #15803d;">C</span>
            <span style="font-size: 20px; font-weight: 600; color: #1f2937;">ure</span>
          </div>
        </div>
        
       <h3>Thank You for Your Order</h3>
    <p>We'll send you tracking information when the order ships.</p>
    <p><strong>Order # ${orderId}</strong></p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <tr style="border-bottom: 1px solid #ddd;">
        <td><strong>Item</strong></td>
        <td><strong>Qty</strong></td>
        <td><strong>Price</strong></td>
      </tr>
      ${productRows}
    </table>
    <p style="margin-top: 10px;"><strong>Order Total: ₹${totalAmount}</strong></p>
    <p style="color: gray; font-size: 12px; margin-top: 20px;">You received this email because you placed the order</p>
  

    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmation };
