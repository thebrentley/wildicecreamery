import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        baseURL: 'https://api.sendgrid.com',
        headers: {},
        timeout: 7000,
        maxRedirects: 5,
      }),
      inject: [],
    }),
  ],
  controllers: [EmailController],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
