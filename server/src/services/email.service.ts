import { transporter, emailTemplates } from '../config/email.config';

export async function sendSignupEmail(email: string, name: string, otp: string) {
  try {
    const { subject, html } = emailTemplates.signup(name, otp);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error('Send signup email error:', error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(email: string, name: string, orderNumber: string, total: number) {
  try {
    const { subject, html } = emailTemplates.orderPlaced(name, orderNumber, total.toString());
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error('Send order confirmation email error:', error);
    throw error;
  }
}

export async function sendOrderDeliveredEmail(email: string, name: string, orderNumber: string) {
  try {
    const { subject, html } = emailTemplates.orderDelivered(name, orderNumber);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error('Send order delivered email error:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, name: string, otp: string) {
  try {
    const { subject, html } = emailTemplates.passwordReset(name, otp);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error('Send password reset email error:', error);
    throw error;
  }
}
