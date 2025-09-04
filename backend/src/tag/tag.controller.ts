import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('products/:tagName')
  async getProducts(@Param('tagName') tagName: string, @Res() res) {
    const products = await this.tagService.getProductsByTagName(tagName);
    return res.status(HttpStatus.OK).json(products);
  }

  @Get('list')
  async list(@Res() res) {
    const tags = await this.tagService.list();
    return res.status(HttpStatus.OK).json(tags);
  }

}
