/* eslint-disable @typescript-eslint/no-explicit-any */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { db } from '../util/db';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({}),
      dataSourceFactory: async () => db(),
    }),
    ProductModule,
    OrderModule,
    EmailModule,
  ],
  providers: [],
})
export class AppModule {}
