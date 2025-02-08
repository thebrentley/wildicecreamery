import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    if (!id) return null;
    return await this.productRepository.findOneBy({ id });
  }
}
