import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderInput } from './types';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderInput: CreateOrderInput) {
    return await this.orderService.createOrder(createOrderInput);
  }
}
