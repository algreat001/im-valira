import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ProductDto } from '../dto';
import { ProductService } from './product.service';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SpecMeta, ProductReviewMeta } from '../model/meta';
import { User } from '../model/user.entity';

@Controller('api/v1/product')
export class ProductController {
  constructor(private productService: ProductService) {

  }

  @Get('/all')
  async getAllProducts(@Res() response) {
    const findProducts = await this.productService.getAll();
    return response.status(HttpStatus.OK).json(findProducts);
  }

  @Post('/:productId')
  async getProductFromId(@Res() response, @Param('productId') productId: number) {
    const findProduct = await this.productService.getOne(productId);
    return response.status(HttpStatus.OK).json(findProduct);
  }

  @Post('/list/:catalogId')
  async getProductList(@Res() response, @Param('catalogId') catalogId: number) {
    const findProducts = await this.productService.getList(catalogId);
    return response.status(HttpStatus.OK).json(findProducts);
  }

  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @Put('/list/:catalogId')
  async setProductList(@Res() response, @Param('catalogId') catalogId: number, @Body() productIds: string[]) {
    const result = await this.productService.setList(catalogId, productIds);
    return response.status(HttpStatus.OK).json(result);
  }

  @Post('/search/:search')
  async getSearchProductList(@Res() response, @Param('search') search: string) {
    const findProducts = await this.productService.getSearchList(search);
    return response.status(HttpStatus.OK).json(findProducts);
  }

  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @Put('add/:productId/to/:catalogId')
  async addProductToCatalog(
    @Res() response,
    @Param('productId') productId: number,
    @Param('catalogId') catalogId: number,
  ) {
    const updateProduct = await this.productService.addToCatalog(catalogId, productId);
    return response.status(HttpStatus.OK).json(updateProduct);
  }

  @Roles('User')
  @UseGuards(RolesGuard)
  @Post('/:productId/review')
  async addReview(
    @Res() response,
    @Req() request,
    @Param('productId') productId: number,
    @Body() review: ProductReviewMeta,
  ) {
    const user = request.user as User;
    const addReview = await this.productService.addReview(productId, user, review);
    return response.status(HttpStatus.OK).json(addReview);
  }

  @Roles('User', 'Moderator', 'Admin')
  @UseGuards(RolesGuard)
  @Put('/:productId/review')
  async updateReview(
    @Res() response,
    @Req() request,
    @Param('productId') productId: number,
    @Body() review: ProductReviewMeta,
  ) {
    const user = request.user as User;
    const updateReview = await this.productService.updateReview(productId, user, review);
    return response.status(HttpStatus.OK).json(updateReview);
  }

  @Roles('User', 'Moderator', 'Admin')
  @UseGuards(RolesGuard)
  @Delete('/:productId/review')
  async deleteReview(
    @Res() response,
    @Req() request,
    @Param('productId') productId: number,
    @Body() review: ProductReviewMeta,
  ) {
    const user = request.user as User;
    await this.productService.deleteReview(productId, user, review);
    return response.status(HttpStatus.OK).json(true);
  }

  @Roles('ProductEditor', 'Admin')
  @UseGuards(RolesGuard)
  @Post('/:productId/spec')
  async addSpec(
    @Res() response,
    @Param('productId') productId: number,
    @Body() spec: SpecMeta,
  ) {
    const addReview = await this.productService.addSpec(productId, spec);
    return response.status(HttpStatus.OK).json(addReview);
  }

  @Roles('ProductEditor', 'Admin')
  @UseGuards(RolesGuard)
  @Put('/:productId/spec')
  async updateCharacteristic(
    @Res() response,
    @Param('productId') productId: number,
    @Body() spec: SpecMeta,
  ) {
    const updateReview = await this.productService.updateSpec(productId, spec);
    return response.status(HttpStatus.OK).json(updateReview);
  }

  @Roles('ProductEditor', 'Admin')
  @UseGuards(RolesGuard)
  @Delete('/:productId/spec')
  async deleteCharacteristic(
    @Res() response,
    @Param('productId') productId: number,
    @Body() spec: SpecMeta,
  ) {
    await this.productService.deleteSpec(productId, spec);
    return response.status(HttpStatus.OK).json(true);
  }

  @Roles('Admin', 'ProductEditor')
  @UseGuards(RolesGuard)
  @Put('/')
  async updateProduct(@Res() response, @Body() dto: ProductDto) {
    const updateProduct = await this.productService.updateProduct(dto);
    return response.status(HttpStatus.OK).json(updateProduct);
  }

  @Roles('Admin', 'ProductEditor')
  @UseGuards(RolesGuard)
  @Delete('/:productId')
  async deleteProduct(@Res() response, @Param() productId: number) {
    await this.productService.deleteProduct(productId);
    return response.status(HttpStatus.OK).json(true);
  }

}
