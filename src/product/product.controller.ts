import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async getAll(): Promise<Product[]> {
    return this.productService.getAll();
  }
}
