import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
import { OrderProduct } from '../order/order-product.entity';

type PassThroughProductDetail = {
  name: string;
  price: number;
  quantity: number;
};

type PassThroughOrder = {
  orderId: string;
  email: string;
  productDetails: PassThroughProductDetail[];
};

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('order')
  async createOrder(@Body() passThroughOrder: PassThroughOrder) {
    const order = new Order();
    order.recipientEmail = passThroughOrder.email;
    order.id = passThroughOrder.orderId;
    order.createdAt = new Date();
    order.orderProducts = passThroughOrder.productDetails.map(
      (productDetail) => {
        const orderProduct = new OrderProduct();
        orderProduct.quantity = productDetail.quantity;
        orderProduct.product = new Product();
        orderProduct.product.name = productDetail.name;
        orderProduct.product.price = productDetail.price;
        return orderProduct;
      },
    );

    return await this.emailService.sendOrderEmail(order);
  }
}
