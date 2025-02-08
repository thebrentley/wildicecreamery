import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { importOrm } from '../util/importOrm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [importOrm(), ProductModule, EmailModule],
  controllers: [OrderController],
  exports: [TypeOrmModule, OrderService],
  providers: [OrderService],
})
export class OrderModule {}
