import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryDto } from '@/dto';
import { Category } from '@/model/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategoryIdsFromParentId(parentcategoryId: number): Promise<number[]> {
    return (await this.getCategorysFromParentId(parentcategoryId)).map(category => category.category_id);
  }

  async getCategorysFromParentId(parentcategoryId: null | number): Promise<Category[]> {
    const where = { where: { parent: parentcategoryId ? { category_id: parentcategoryId } : IsNull() } };
    const categorys = await this.categoryRepository.find(where);
    if (!categorys) {
      throw new BadRequestException();
    }
    return categorys;
  }

  async getOneDto(id: number): Promise<CategoryDto> {
    const category = await this.getOne(id);
    return category.dto;
  }

  async getAllDto(): Promise<CategoryDto[]> {
    const category = await this.getAll();
    return category.map(category => category.dto);
  }

  async getAll(): Promise<Category[]> {
    const category = await this.categoryRepository.find({ take: 1000 });
    if (!category) {
      throw new BadRequestException();
    }
    return category;
  }


  async getOne(category_id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { category_id } });
    if (!category) {
      throw new BadRequestException();
    }
    return category;
  }

  async getOneWithProductIds(category_id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { category_id },
      loadRelationIds: { relations: [ 'products' ], disableMixedMap: true },
    });
    if (!category) {
      throw new BadRequestException();
    }
    return category;
  }

  async mergeDataFromDto(dest: Category, source: CategoryDto): Promise<void> {
    dest.name = source.name;
    dest.meta = source.meta;
    dest.hasChildren = source.hasChildren;
    if (source.parent) {
      console.log('parent', source.parent);
      dest.parent = await this.getOne(source.parent);
    }
  }

  async newCategoryFromDto(source: CategoryDto): Promise<Category> {
    const dest = new Category();
    await this.mergeDataFromDto(dest, source);
    return dest;
  }

  async saveEntity(category: Category): Promise<void> {
    await this.categoryRepository.save(category);
  }

  async save(dto: CategoryDto): Promise<CategoryDto> {
    let category: Category;
    this.validate(dto);
    if (!dto.category_id) {
      category = await this.newCategoryFromDto(dto);
    } else {
      category = await this.getOne(dto.category_id);
      await this.mergeDataFromDto(category, dto);
    }
    await this.categoryRepository.save(category);
    return category.dto;
  }

  async delete(category_id: number): Promise<void> {
    const countChild = await this.categoryRepository.count({ where: { parent: { category_id } } });
    if (countChild > 0) {
      throw new BadRequestException();
    }
    const deleteEntity = await this.categoryRepository.findOne({ where: { category_id }, relations: [ 'parent' ] });
    if (!deleteEntity) {
      throw new BadRequestException();
    }
    const parent = deleteEntity.parent;
    await this.categoryRepository.delete({ category_id });
    if (!parent) {
      return;
    }
    const countChildParent = await this.categoryRepository.count({ where: { parent: { category_id: parent.category_id } } });
    if (countChildParent > 0) {
      return;
    }
    parent.hasChildren = false;
    await this.categoryRepository.save(parent);
  }

  validate(dto: CategoryDto) {
    if (dto.name === null || dto.meta === null) {
      throw new BadRequestException();
    }
  }

}
