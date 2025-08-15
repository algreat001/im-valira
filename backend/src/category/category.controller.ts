import { Controller, HttpStatus, Put, Body, Param, Post, Res, UseGuards, Delete, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '../dto';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('api/v1/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/all')
  async getAllCategories(@Res() response) {
    const findCategories = await this.categoryService.getAllDto();
    return response.status(HttpStatus.OK).json(findCategories);

  }

  @Post('/list/:parentCatalogId')
  async getCategoryFromParentId(@Res() response, @Param('parentCatalogId') parentCatalogId: number) {
    const findCatalogs = await this.categoryService.getCategoryIdsFromParentId(parentCatalogId);
    return response.status(HttpStatus.OK).json(findCatalogs);
  }

  @Post('/list')
  async getMainCategory(@Res() response) {
    const findCatalogs = await this.categoryService.getCategoryIdsFromParentId(null);
    return response.status(HttpStatus.OK).json(findCatalogs);
  }

  @Post('/:catalogId')
  async getOneCategory(@Res() response, @Param('catalogId') catalogId: number) {
    const findCatalogs = await this.categoryService.getOneDto(catalogId);
    return response.status(HttpStatus.OK).json(findCatalogs);
  }

  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @Put('/')
  async saveCategory(@Res() response, @Body() dto: CategoryDto) {
    const findCatalogs = await this.categoryService.save(dto);
    return response.status(HttpStatus.OK).json(findCatalogs);
  }

  @Roles('Admin', 'Editor')
  @UseGuards(RolesGuard)
  @Delete('/:deleteId')
  async deleteCategory(@Res() response, @Param('deleteId') id: number) {
    await this.categoryService.delete(id);
    return response.status(HttpStatus.OK).json(true);
  }

}
