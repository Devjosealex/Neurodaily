import { Module, Global } from '@nestjs/common';
import Stripe from 'stripe';

const stripeFactory = {
  provide: 'STRIPE_CLIENT',
  useFactory: () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
      // @ts-ignore
      apiVersion: '2023-10-16',
    });
  },
};

@Global()
@Module({
  providers: [stripeFactory],
  exports: ['STRIPE_CLIENT'],
})
export class StripeModule {}
