import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TelegramService } from '../telegram/telegram.service';
import { NodeHtmlMarkdown } from 'node-html-markdown';

@Injectable()
export class SendService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly telegramService: TelegramService,
  ) {}

  async sendOrder(email: string, orderHtml: string): Promise<boolean> {
    const telegramMessage =
      '*Новый заказ в интернет магазине "Valira decor"*\n' +
      NodeHtmlMarkdown.translate(orderHtml, {})
        .replace('\n|', '\n')
        .replace('  ', ' ')
        .replace('  ', ' ')
        .replace('  ', ' ')
        .replace('  ', ' ')
        .replace('  ', ' ')
        .replace('| ----------------- | --------------------- | ------ | ---------- |','');

    return (
      await Promise.all([
        this.sendMail(
          email,
          'Заказ в интернет магазине "Valira-decor"',
          orderHtml,
        ),
        this.telegramService.sendMessage(telegramMessage),
      ])
    ).reduce((accum, current) => accum && current, true);
  }

  private async sendMail(
    email: string,
    subj: string,
    body: string,
  ): Promise<boolean> {
    const addr = 'office@energy-soft.ru';
    try {
      const res1 = await this.mailerService.sendMail({
        from: 'office@energy-soft.ru',
        to: addr,
        subject: subj,
        html: body,
      });
      const res2 = await this.mailerService.sendMail({
        from: 'office@energy-soft.ru',
        to: email,
        subject: subj,
        html: body,
      });
      return res1 && res2;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
