import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the authenticated user's Clerk ID from the request.
 * Use in controllers: @CurrentUser() clerkUserId: string
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.clerkUserId as string;
  },
);

/**
 * Extracts the local database User UUID from the request.
 * Use in controllers: @LocalUserId() userId: string
 */
export const LocalUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.userId as string;
  },
);

