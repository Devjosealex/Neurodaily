import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
  ) {}

  async getCurrentSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });
    
    if (!sub) {
      return { plan: 'free', status: 'active' };
    }
    return sub;
  }

  async createCheckoutSession(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    let sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    let stripeCustomerId = sub?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;

      if (!sub) {
        sub = await this.prisma.subscription.create({
          data: {
            userId: user.id,
            stripeCustomerId,
          },
        });
      } else {
        sub = await this.prisma.subscription.update({
          where: { userId: user.id },
          data: { stripeCustomerId },
        });
      }
    }

    const priceId = process.env.STRIPE_PRO_PRICE_ID;
    if (!priceId) throw new Error('STRIPE_PRO_PRICE_ID is not configured');

    const session = await this.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings/billing?canceled=true`,
      metadata: { userId },
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!sub?.stripeCustomerId) {
      throw new NotFoundException('No active stripe customer found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings/billing`,
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, body: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET is not configured');

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;
          
          await this.prisma.subscription.update({
            where: { stripeCustomerId: customerId },
            data: {
              plan: 'pro',
              status: 'active',
              stripeSubscriptionId: subscriptionId,
            },
          });
          // Call Clerk API here to update metadata if needed
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            plan: subscription.status === 'active' ? 'pro' : 'free',
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan: 'free',
            status: 'canceled',
            cancelAtPeriodEnd: false,
          },
        });
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
