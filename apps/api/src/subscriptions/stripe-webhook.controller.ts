import { Controller, Post, Headers, Req, Res, RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';
import { SubscriptionsService } from './subscriptions.service';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    if (!signature) {
      return res.status(400).send('Missing stripe-signature');
    }

    // El rawBody es necesario para verificar la firma de Stripe
    const rawBody = req.rawBody;
    if (!rawBody) {
      return res.status(400).send('Webhook error: No raw body found');
    }

    try {
      await this.subscriptionsService.handleWebhook(signature, rawBody);
      res.status(200).json({ received: true });
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
