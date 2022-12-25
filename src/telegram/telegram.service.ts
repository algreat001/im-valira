import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TelegramOptions } from './telegram.config';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private options: TelegramOptions;

  constructor() {
    this.options = new TelegramOptions();
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(
    message: string,
    chatId = this.options.chatId,
  ): Promise<boolean> {
    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'MarkdownV2',
      });
      return true;
    } catch (e) {
      console.log('TELEGRAM ERROR', e.message);
      return false;
    }
  }
}
