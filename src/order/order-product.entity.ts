import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';

@Entity()
export class OrderProduct extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'order_id', type: 'text' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.orderProducts, {})
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.orderProducts, {
    cascade: true,
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
