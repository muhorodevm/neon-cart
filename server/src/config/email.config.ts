import nodemailer from "nodemailer";

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
    subject: "Welcome to Ndula - Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Ndula!</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                      <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">Thank you for joining Ndula! To complete your registration and verify your email address, please use the verification code below:</p>
                      
                      <!-- OTP Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <div style="background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%); border: 2px dashed #667eea; border-radius: 8px; padding: 20px; display: inline-block;">
                              <p style="margin: 0 0 10px; color: #666666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                              <p style="margin: 0; color: #667eea; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                        <strong>Important:</strong> This verification code will expire in <strong>10 minutes</strong>.
                      </p>
                      <p style="margin: 15px 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                        If you didn't create an account with Ndula, please ignore this email.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.6;">
                        © ${new Date().getFullYear()} Ndula. All rights reserved.<br>
                        Premium footwear and fashion for everyone.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  orderPlaced: (name: string, orderNumber: string, total: string) => ({
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 40px 30px; text-align: center;">
                      <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 32px;">✓</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Order Confirmed!</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                      <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">Thank you for your order! We've received it and our team is already working on preparing your items for shipment.</p>
                      
                      <!-- Order Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 25px; margin: 30px 0;">
                        <tr>
                          <td>
                            <h2 style="margin: 0 0 20px; color: #333333; font-size: 18px; font-weight: 600;">Order Details</h2>
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Order Number:</td>
                                <td style="color: #333333; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${orderNumber}</td>
                              </tr>
                              <tr>
                                <td style="color: #666666; font-size: 14px; padding: 8px 0;">Total Amount:</td>
                                <td style="color: #10b981; font-size: 18px; font-weight: 700; text-align: right; padding: 8px 0;">KSh ${total}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0; color: #666666; font-size: 15px; line-height: 1.6;">
                        You'll receive another email with tracking information once your order ships. We typically process orders within 1-2 business days.
                      </p>
                      <p style="margin: 20px 0 0; color: #666666; font-size: 15px; line-height: 1.6;">
                        If you have any questions about your order, feel free to contact our customer support team.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.6;">
                        © ${new Date().getFullYear()} Ndula. All rights reserved.<br>
                        Premium footwear and fashion for everyone.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  orderDelivered: (name: string, orderNumber: string) => ({
    subject: `Your Order Has Been Delivered - ${orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 40px 30px; text-align: center;">
                      <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 32px;">📦</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Order Delivered!</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                      <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">Great news! Your order <strong style="color: #333333;">${orderNumber}</strong> has been successfully delivered to your address.</p>
                      
                      <!-- Delivery Confirmation Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; padding: 25px; margin: 30px 0; border: 2px solid #3b82f6;">
                        <tr>
                          <td align="center">
                            <p style="margin: 0 0 10px; color: #3b82f6; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Delivery Status</p>
                            <p style="margin: 0; color: #1e40af; font-size: 24px; font-weight: 700;">Successfully Delivered ✓</p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0; color: #666666; font-size: 15px; line-height: 1.6;">
                        We hope you love your new items! Your satisfaction is our top priority, and we're thrilled to have you as a customer.
                      </p>
                      <p style="margin: 20px 0 0; color: #666666; font-size: 15px; line-height: 1.6;">
                        If you have any questions, concerns, or feedback about your order, please don't hesitate to reach out to our customer support team. We're here to help!
                      </p>
                      <p style="margin: 30px 0 0; color: #333333; font-size: 15px; line-height: 1.6; font-weight: 600;">
                        Thank you for choosing Ndula! 🎉
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.6;">
                        © ${new Date().getFullYear()} Ndula. All rights reserved.<br>
                        Premium footwear and fashion for everyone.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),

  passwordReset: (name: string, otp: string) => ({
    subject: "Password Reset Request - Ndula",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 40px 30px; text-align: center;">
                      <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 32px;">🔐</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Password Reset Request</h1>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
                      <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">We received a request to reset your password for your Ndula account. Use the verification code below to proceed with resetting your password:</p>
                      
                      <!-- OTP Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px dashed #f59e0b; border-radius: 8px; padding: 20px; display: inline-block;">
                              <p style="margin: 0 0 10px; color: #92400e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Reset Code</p>
                              <p style="margin: 0; color: #f59e0b; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 15px; margin: 30px 0;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                              <strong>⚠️ Security Notice:</strong><br>
                              This code will expire in <strong>10 minutes</strong>. If you didn't request this password reset, please ignore this email and ensure your account is secure.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        For your security, never share this code with anyone. Ndula will never ask you for this code via phone, email, or any other method.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 13px; text-align: center; line-height: 1.6;">
                        © 2024 Ndula. All rights reserved.<br>
                        Premium footwear and fashion for everyone.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  }),
};
