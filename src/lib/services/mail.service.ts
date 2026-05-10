import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ses } from '@/lib/utils/ses.util';

const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

class MailService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async sendEmail(toEmail: string, templatePath: string, templateData: any, subject: string) {
    const templateContent = fs.readFileSync(
      path.join(TEMPLATES_DIR, templatePath),
      'utf8',
    );

    const params = {
      Destination: { ToAddresses: [toEmail] },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: ejs.render(templateContent, templateData),
          },
        },
        Subject: { Charset: 'UTF-8', Data: subject },
      },
      Source: 'WorkPlay Studio Pvt Ltd. <no-reply@workplay.digital>',
    };

    await ses.send(new SendEmailCommand(params));
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
