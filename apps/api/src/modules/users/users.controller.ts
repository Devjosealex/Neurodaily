import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() clerkUserId: string) {
    return this.usersService.findByClerkId(clerkUserId);
  }

  @Patch('me/preferences')
  async updatePreferences(
    @CurrentUser() clerkUserId: string,
    @Body() preferences: any,
  ) {
    return this.usersService.updatePreferences(clerkUserId, preferences);
  }
}
