import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { SendService } from './send.service';

@Controller('send')
export class SendController {
  constructor(private sendService: SendService) {
  }

  @Post('/order')
  async sendOrder(@Res() response, @Body() data: { email: string; orderHtml: string }) {
    const result = await this.sendService.sendOrder(data.email, data.orderHtml);
    return response.status(HttpStatus.OK).json(result);
  }

}
