import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const emailTemplates = {
  signup: (name: string, otp: string) => ({
    subject: 'Welcome to Ndula - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Ndula, ${name}!</h1>
        <p>Thank you for signing up. Please verify your email using the OTP below:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  }),
  
  orderPlaced: (name: string, orderNumber: string, total: string) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your order. We're processing it now.</p>
        <div style="background: #f4f4f4; padding: 20px; margin: 20px 0;">
          <h2>Order Details</h2>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total:</strong> KSh ${total}</p>
        </div>
        <p>You'll receive another email when your order ships.</p>
      </div>
    `,
  }),
  
  orderDelivered: (name: string, orderNumber: string) => ({
    subject: `Your Order Has Been Delivered - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Delivered!</h1>
        <p>Hi ${name},</p>
        <p>Great news! Your order <strong>${orderNumber}</strong> has been delivered.</p>
        <p>We hope you love your new items. If you have any questions or concerns, please don't hesitate to contact us.</p>
        <p>Thank you for shopping with Ndula!</p>
      </div>
    `,
  }),
  
  passwordReset: (name: string, otp: string) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Use the OTP below to proceed:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
  }),
};
