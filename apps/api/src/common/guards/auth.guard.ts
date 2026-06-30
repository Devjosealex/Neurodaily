import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
  });

  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      // Verify Clerk JWT
      const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! });
      const clerkUserId = payload.sub;

      // Sync user locally (auto-create if doesn't exist)
      let user = await this.prisma.user.findUnique({
        where: { clerkUserId },
        select: { id: true }
      });

      if (!user) {
        // Fetch user details from Clerk if needed, or just create with defaults
        const clerkUser = await this.clerk.users.getUser(clerkUserId);
        const email = clerkUser.emailAddresses[0]?.emailAddress || '';
        const name = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null;

        user = await this.prisma.user.create({
          data: {
            clerkUserId,
            email,
            name,
          },
          select: { id: true }
        });
      }

      // Attach to request
      (request as any).clerkUserId = clerkUserId;
      (request as any).userId = user.id;

      return true;
    } catch (err) {
      console.error('AuthGuard error:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
