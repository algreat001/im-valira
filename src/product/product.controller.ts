import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { ProductDto, UserDto } from "../dto";
import { ProductService } from "./product.service";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("api/v1/product")
export class ProductController {
  constructor(private productService: ProductService) {

  }

  @Post("/:productId")
  async getProductFromId(@Res() response, @Param("productId") productId: string) {
    const findProduct = await this.productService.getOne(productId);
    return response.status(HttpStatus.OK).json(findProduct);
  }

  @Post("/list/:catalogId")
  async getProductList(@Res() response, @Param("catalogId") catalogId: string) {
    const findProducts = await this.productService.getList(catalogId);
    return response.status(HttpStatus.OK).json(findProducts);
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
