import { Controller, HttpStatus, Put, Body, Param, Post, Res, UseGuards, Delete } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { CatalogDto } from "../dto";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("api/v1/catalog")
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Post("/list/:parentCatalogId")
  async getCatalogFromParentId(@Res() response, @Param("parentCatalogId") parentCatalogId: string) {
    const findCatalogs = await this.catalogService.getCatalogIdsFromParentId(parentCatalogId);
    return response.status(HttpStatus.OK).json(findCatalogs);
  }

  @Post("/list")
  async getMainCatalog(@Res() response) {
    const findCatalogs = await this.catalogService.getCatalogIdsFromParentId(null);
    return response.status(HttpStatus.OK).json(findCatalogs);
  }

  @Post("/:catalogId")
  async getOneCatalog(@Res() response, @Param("catalogId") catalogId: string) {
    const findCatalogs = await this.catalogService.getOneDto(catalogId);
    return response.status(HttpStatus.OK).json(findCatalogs);
  }

  @Roles("Admin", "Editor")
  @UseGuards(RolesGuard)
  @Put("/")
  async saveCatalog(@Res() response, @Body() dto: CatalogDto) {
    const findCatalogs = await this.catalogService.save(dto);
    return response.status(HttpStatus.OK).json(findCatalogs);
  }

  @Roles("Admin", "Editor")
  @UseGuards(RolesGuard)
  @Delete("/:deleteId")
  async deleteCatalog(@Res() response, @Param("deleteId") id: string) {
    const findCatalogs = await this.catalogService.delete(id);
    return response.status(HttpStatus.OK).json(true);
  }

}
