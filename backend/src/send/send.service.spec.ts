import { Test, TestingModule } from '@nestjs/testing';
import { SendService } from './send.service';
import { TelegramModule } from '@/telegram/telegram.module';
import { SendController } from '@/send/send.controller';

describe('SendService', () => {
  let service: SendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ TelegramModule ],
      controllers: [ SendController ],
      providers: [ SendService ],
    }).compile();

    service = module.get<SendService>(SendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
