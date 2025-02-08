import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from 'src/order/order-product.entity';
import { Order } from 'src/order/order.entity';
import { Product } from 'src/product/product.entity';

export const entities = () => [Product, Order, OrderProduct];
export const importOrm = () => TypeOrmModule.forFeature(entities());
