import { Body, Controller, Delete, HttpStatus, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ProductDto, UserDto } from "../dto";
import { ProductService } from "./product.service";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("api/v1/product")
export class ProductController {
  constructor(private productService: ProductService) {

  }

  @Post("/")
  async getProductFromId(@Res() response, @Body() productId: string) {
    const findProduct = await this.productService.getOne(productId);
    return response.status(HttpStatus.OK).json(findProduct);
  }

  @Roles("Admin")
  @UseGuards(RolesGuard)
  @Put("/")
  async updateProduct(@Res() response, @Body() dto: ProductDto) {
    const updateProduct = await this.productService.updateProduct(dto);
    return response.status(HttpStatus.OK).json(updateProduct);
  }

  @Roles("Admin")
  @UseGuards(RolesGuard)
  @Delete("/")
  async deleteProduct(@Res() response, @Body() productId: string) {
    const updateProduct = await this.productService.deleteProduct(productId);
    return response.status(HttpStatus.OK).json("ok");
  }

}
