import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from '../order/order.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';
import { join } from 'path';
import * as fs from 'fs';
import { DateTime } from 'luxon';

@Injectable()
export class EmailService {
  private readonly orderTemplate = Handlebars.compile(
    fs
      .readFileSync(join(process.cwd(), `./src/email/order-template.html`))
      .toString(),
  );

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    Handlebars.registerHelper('formatDate', function (date) {
      return DateTime.fromJSDate(date)
        .setZone('local')
        .toFormat('LLLL d, yyyy h:mm a');
    });
  }

  async sendOrderEmail(order: Order): Promise<boolean> {
    console.log(this.orderTemplate({ order }));
    await this.sendEmail(
      order.recipientEmail,
      'Your Wild Ice Creamery Order',
      this.orderTemplate({ order }),
    );

    return true;
  }

  async sendEmail(
    recipientEmail: string,
    subject: string,
    content: string,
  ): Promise<any> {
    await firstValueFrom(
      this.httpService
        .post<any>(
          `/v3/mail/send`,
          {
            personalizations: [
              {
                to: [
                  {
                    email: recipientEmail,
                  },
                ],
                subject,
              },
            ],
            content: [{ type: 'text/html', value: content }],
            from: {
              email: this.configService.getOrThrow('SENDGRID_FROM_EMAIL'),
              name: 'Wild Ice Creamery',
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.configService.getOrThrow('SENDGRID_API_KEY')}`,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw new HttpException(
              { reason: 'Send mail failed!' },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }),
        ),
    );
  }
}
function moment(date: any) {
  throw new Error('Function not implemented.');
}
