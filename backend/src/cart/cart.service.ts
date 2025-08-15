import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddCartItemDto, CartItemDto, UpdateCartItemDto } from '../dto';
import { Cart } from '../model/cart.entity';
import { Product } from '../model/product.entity';
import { User } from '../model/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAllByUser(user: User): Promise<CartItemDto[]> {
    const items = await this.cartRepository.find({
      where: { user: { user_id: user.user_id } },
      relations: { product: true, user: true },
    });
    return items.map(item => item.dto);
  }

  async add(user: User, addCartDto: AddCartItemDto): Promise<CartItemDto> {
    const product = await this.productRepository.findOne({ where: { product_id: addCartDto.product_id } });
    if (!product) {
      console.log(`[cart.add] Product not found id: ${addCartDto.product_id}, user: ${user.email}`);
      throw new BadRequestException();
    }
    const variant = product.variants.find(v => v.product_variant_id === addCartDto.variant_id);

    const cartItem = Cart.fromProduct(user, addCartDto.quantity, product, variant);
    const result = await this.cartRepository.save(cartItem);
    console.log('This action adds a new cart', addCartDto);
    return result.dto;
  }

  findOne(user_id: number, cart_item_id: number): Promise<Cart | undefined> {
    return this.cartRepository.findOne({
      where: { cart_item_id, user: { user_id } },
      relations: { product: true, user: true },
    });
  }

  async update(user: User, cart_item_id: number, updateCartDto: UpdateCartItemDto): Promise<CartItemDto> {
    const cartItem = await this.findOne(user.user_id, cart_item_id);
    if (!cartItem) {
      console.log(`[cart.update] Cart item not found id: ${cart_item_id}, user: ${user.email}`);
      throw new BadRequestException();
    }

    cartItem.quantity = updateCartDto.quantity;
    const result = await this.cartRepository.save(cartItem);
    return result.dto;
  }

  async remove(user: User, cart_item_id: number) {
    const cartItem = await this.findOne(user.user_id, cart_item_id);
    if (!cartItem) {
      console.log(`[cart.remove] Cart item not found id: ${cart_item_id}, user: ${user.email}`);
      throw new BadRequestException();
    }

    const result = await this.cartRepository.delete(cart_item_id);
    return result.affected > 0;
  }

  async removeAll(user: User) {
    const result = await this.cartRepository.delete({ user: { user_id: user.user_id } });
    return result.affected > 0;
  }
}
