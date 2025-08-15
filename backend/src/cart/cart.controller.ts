import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() request, @Res() response) {
    const items = await this.cartService.findAllByUser(request.user);
    console.log(`[cart.findAllByUser] user: ${request.user.email}, items: ${items.length}`);
    return response.status(HttpStatus.OK).json(items);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/items')
  async add(@Body() addCartItemDto: AddCartItemDto, @Req() request, @Res() response) {
    const item = await this.cartService.add(request.user, addCartItemDto);
    console.log(`[cart.add] user: ${request.user.email}, items: ${item.name}`);
    return response.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() request, @Res() response) {
    const item = await this.cartService.findOne(request.user.user_id, id);
    console.log(`[cart.findOne] user: ${request.user.email}, items: ${item.name}`);
    return response.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCartDto: UpdateCartItemDto, @Req() request, @Res() response) {
    const item = await this.cartService.update(request.user, id, updateCartDto);
    console.log(`[cart.update] user: ${request.user.email}, items: ${item.name}`);
    return response.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/all')
  async removeAll(@Req() request, @Res() response) {
    const item = await this.cartService.removeAll(request.user);
    console.log(`[cart.removeAll] user: ${request.user.email}`);
    return response.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request, @Res() response) {
    const item = await this.cartService.remove(request.user, id);
    console.log(`[cart.remove] user: ${request.user.email}, items: ${id}`);
    return response.status(HttpStatus.OK).json(item);
  }

}
