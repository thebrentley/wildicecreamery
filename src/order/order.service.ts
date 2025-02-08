import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderInput, ProductInput } from './types';
import { ProductService } from '../product/product.service';
import { createId } from '@paralleldrive/cuid2';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
    private readonly emailService: EmailService,
  ) {}

  async createOrder(createOrderInput: CreateOrderInput) {
    if (!createOrderInput.email) {
      throw new BadRequestException('Email is required');
    }
    if (!createOrderInput.products?.length) {
      throw new BadRequestException('Products are required');
    }

    // verify that all product are valid first
    // we want to make sure all the products are valid before we attempt to create any
    // TODO: consider transaction/rollback instead
    await Promise.all(
      createOrderInput.products.map(async (productInput: ProductInput) => {
        const product = await this.productService.getProductById(
          productInput.id,
        );
        if (!product) {
          throw new NotFoundException(
            `Product with id ${productInput.id} not found`,
          );
        }
        if (!productInput.quantity) {
          throw new BadRequestException(
            `Product ${productInput.id} does not have a quantity`,
          );
        }
      }),
    );

    // create the order
    let order = await this.orderRepository.save({
      id: createId(),
      recipientEmail: createOrderInput.email,
      orderProducts: createOrderInput.products.map((product: ProductInput) => {
        return {
          productId: product.id,
          quantity: product.quantity,
        };
      }),
    });

    // refetch to get product details
    order = await this.orderRepository.findOne({
      where: { id: order.id },
      relations: { orderProducts: { product: true } },
    });

    this.emailService.sendOrderEmail(order);

    return order;
  }
}
