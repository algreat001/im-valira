import {
  Controller,
  Get,
  UseGuards,
  Res,
  HttpStatus,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/auth/roles-auth.decorator';
import { RolesGuard } from '@/auth/roles.guard';

import { AdminProductService } from './admin.product.service';
import { ProductDto } from '@/dto';

@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly productService: AdminProductService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Get('/list')
  async getAllProducts(@Res() response) {
    const findProducts = await this.productService.getAll();
    console.log(`[admin.product.getAllProducts] count: ${findProducts.length}`);
    return response.status(HttpStatus.OK).json(findProducts);
  }

  // Create product
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Post()
  async createProduct(@Res() response, @Body() payload: ProductDto) {
    const product = await this.productService.create(payload);
    console.log(`[admin.product.createProduct],  payload: ${JSON.stringify(payload)}`);
    return response.status(HttpStatus.OK).json(product);
  }

  // Update product
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Patch('/:product_id')
  async updateProduct(@Param('product_id') product_id: number, @Res() response, @Body() payload: ProductDto) {
    const product = await this.productService.update(Number(product_id), payload);
    console.log(`[admin.product.updateProduct] product_id: ${product_id}, payload: ${JSON.stringify(payload)}`);
    return response.status(HttpStatus.OK).json(product);
  }

  // Delete product
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Delete('/:product_id')
  async deleteProduct(@Param('product_id') product_id: number, @Res() response) {
    await this.productService.remove(Number(product_id));
    return response.status(HttpStatus.OK).json({ ok: true });
  }

  // Variants list
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Get('/:product_id/variants')
  async listVariants(@Param('product_id') product_id: number, @Res() response) {
    const variants = await this.productService.listVariants(Number(product_id));
    return response.status(HttpStatus.OK).json(variants);
  }

  // Create variant
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Post('/:product_id/variants')
  async createVariant(@Param('product_id') product_id: number, @Res() response, @Body() payload: any) {
    const variant = await this.productService.createVariant(Number(product_id), payload);
    return response.status(HttpStatus.OK).json(variant);
  }

  // Update variant
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Patch('/:product_id/variants/:variant_id')
  async updateVariant(
    @Param('product_id') product_id: number,
    @Param('variant_id') variant_id: number,
    @Res() response,
    @Body() payload: any,
  ) {
    const variant = await this.productService.updateVariant(Number(product_id), Number(variant_id), payload);
    return response.status(HttpStatus.OK).json(variant);
  }

  // Delete variant
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Delete('/:product_id/variants/:variant_id')
  async deleteVariant(
    @Param('product_id') product_id: number,
    @Param('variant_id') variant_id: number,
    @Res() response,
  ) {
    await this.productService.deleteVariant(Number(product_id), Number(variant_id));
    return response.status(HttpStatus.OK).json({ ok: true });
  }

}
