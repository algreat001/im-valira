import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendService {
  constructor(private readonly mailerService: MailerService) {

  }

  async sendOrder(email: string, orderHtml: string): Promise<boolean> {
    return this.sendMail(email, "Заказ в интернет магазине \"Valira-decor\"", orderHtml);
  }
  
  private async sendMail(email: string, subj: string, body: string) {
    const addr = "office@energy-soft.ru";
    try {
      const res1 = await this.mailerService.sendMail({
        from: "office@energy-soft.ru",
        to: addr,
        subject: subj,
        html: body
      });
      const res2 = await this.mailerService.sendMail({
        from: "office@energy-soft.ru",
        to: email,
        subject: subj,
        html: body
      });
      return res1 && res2;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

}
