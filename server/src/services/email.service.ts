import { transporter, emailTemplates } from '../config/email.config';

export class EmailService {
  async sendEmail(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Email error:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendSignupEmail(email: string, name: string, otp: string) {
    const { subject, html } = emailTemplates.signup(name, otp);
    await this.sendEmail(email, subject, html);
  }

  async sendOrderPlacedEmail(
    email: string,
    name: string,
    orderNumber: string,
    total: string
  ) {
    const { subject, html } = emailTemplates.orderPlaced(name, orderNumber, total);
    await this.sendEmail(email, subject, html);
  }

  async sendOrderDeliveredEmail(
    email: string,
    name: string,
    orderNumber: string
  ) {
    const { subject, html } = emailTemplates.orderDelivered(name, orderNumber);
    await this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(email: string, name: string, otp: string) {
    const { subject, html } = emailTemplates.passwordReset(name, otp);
    await this.sendEmail(email, subject, html);
  }
}
