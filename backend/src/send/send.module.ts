import { Module } from '@nestjs/common';
import { SendController } from '@/send/send.controller';
import { SendService } from '@/send/send.service';
import { TelegramModule } from '@/telegram/telegram.module';

@Module({
  imports: [ TelegramModule ],
  controllers: [ SendController ],
  providers: [ SendService ],
  exports: [ SendService ],
})
export class SendModule {}
