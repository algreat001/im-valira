import { Module } from '@nestjs/common';
import { SendController } from './send.controller';
import { SendService } from './send.service';
import { TelegramModule } from '@/telegram/telegram.module';

@Module({
  imports: [ TelegramModule ],
  controllers: [ SendController ],
  providers: [ SendService ],
})
export class SendModule {}
