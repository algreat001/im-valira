import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/auth/roles-auth.decorator';
import { RolesGuard } from '@/auth/roles.guard';
import { CreateOrderDto, NewOrderDto, UpdateOrderDto } from '@/dto';
import { OrderStatus } from '@/model/order.entity';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/list/:status')
  async getAllWorkOrder(@Param('status') status: string, @Req() request, @Res() response) {
    const items = await this.orderService.findAllByUser(request.user, status === 'completed');
    console.log(`[order.getAllWorkOrder] user: ${request.user.email}`);
    return response.status(HttpStatus.OK).json(items);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create/cart')
  async createFromCart(@Body() createOrderDto: CreateOrderDto, @Req() request, @Res() response) {
    const item = await this.orderService.createFromCart(request.user, createOrderDto);
    console.log(`[order.createFromCart] user: ${request.user.email}`);
    return response.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/cancel/:id')
  async cancelRequest(@Param('id') id: number, @Req() request, @Res() response) {
    const item = await this.orderService.cancelRequest(request.user, id);
    console.log(`[order.cancelRequest] user: ${request.user.email}`);
    return response.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/items/:id')
  async getOneOrder(@Param('id') id: number, @Req() request, @Res() response) {
    const items = await this.orderService.findItems(request.user.user_id, id);
    console.log(`[order.getOneOrder] user: ${request.user.email}, items: ${items.length}`);
    return response.status(HttpStatus.OK).json(items);
  }

  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/admin/list/:status')
  async getAdminAllStatusWorkOrder(@Param('status') status: OrderStatus, @Req() request, @Res() response) {
    const items = await this.orderService.findAll(status);
    console.log(`[order.getAdminAllWorkOrder] user: ${request.user.email}`);
    return response.status(HttpStatus.OK).json(items);
  }

  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/admin/list')
  async getAdminAllWorkOrder(@Param('status') status: OrderStatus, @Req() request, @Res() response) {
    const items = await this.orderService.findAll();
    console.log(`[order.getAdminAllWorkOrder] user: ${request.user.email}`);
    return response.status(HttpStatus.OK).json(items);
  }


  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/admin')
  async create(@Body() newOrderDto: NewOrderDto, @Req() request, @Res() response) {
    const item = await this.orderService.create(newOrderDto);
    console.log(`[order.createFromCart] user: ${request.user.email}`);
    return response.status(HttpStatus.OK).json(item);
  }

  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch('/admin/:id')
  async update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto, @Req() request, @Res() response) {
    const item = await this.orderService.update(id, updateOrderDto);
    console.log(`[order.update] user: ${request.user.email}, order: ${id}`);
    return response.status(HttpStatus.OK).json(item);
  }

  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  async remove(@Param('id') id: number, @Req() request, @Res() response) {
    const item = await this.orderService.remove(id);
    console.log(`[order.remove] user: ${request.user.email}, order: ${id}`);
    return response.status(HttpStatus.OK).json(item);
  }

}
