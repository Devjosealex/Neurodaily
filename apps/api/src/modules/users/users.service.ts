import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async syncUser(clerkUserId: string, email: string, name?: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return this.prisma.user.create({
        data: {
          clerkUserId,
          email,
          name,
        },
      });
    }

    // Optional: update name/email if changed
    if (user.email !== email || user.name !== name) {
      return this.prisma.user.update({
        where: { clerkUserId },
        data: { email, name },
      });
    }

    return user;
  }

  async findByClerkId(clerkUserId: string) {
    return this.prisma.user.findUnique({
      where: { clerkUserId },
    });
  }

  async updatePreferences(clerkUserId: string, preferences: any) {
    return this.prisma.user.update({
      where: { clerkUserId },
      data: { preferences },
    });
  }
}
