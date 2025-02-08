import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderProduct } from './order-product.entity';

@Entity()
export class Order extends BaseEntity {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  recipientEmail: string;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
  })
  orderProducts: OrderProduct[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
