import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { importOrm } from '../util/importOrm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [importOrm()],
  controllers: [ProductController],
  exports: [TypeOrmModule, ProductService],
  providers: [ProductService],
})
export class ProductModule {}
