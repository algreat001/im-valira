import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CreateCartDto, UpdateCartDto } from "../dto";

@Controller("api/v1/cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cartService.remove(+id);
  }
}
