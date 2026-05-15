import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import config from '@/lib/config';
import { transporter } from '@/lib/utils/mailer.util';

const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

class MailService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendEmail(toEmail: string, templatePath: string, templateData: any, subject: string) {
    const templateContent = fs.readFileSync(
      path.join(TEMPLATES_DIR, templatePath),
      'utf8',
    );

    await transporter.sendMail({
      from: `Urbanvana <${config.GMAIL_USER}>`,
      to: toEmail,
      subject,
      html: ejs.render(templateContent, templateData),
    });

    return {};
  }

  async sendOrderConfirmationEmail(
    toEmail: string,
    data: { orderId: string; total: number; items: unknown[] },
  ) {
    return this.sendEmail(
      toEmail,
      'order-confirmation.ejs',
      data,
      `Order Confirmed — ${data.orderId}`,
    );
  }
}

export default new MailService();
