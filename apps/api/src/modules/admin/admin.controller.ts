import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('micro-actions')
  getMicroActions(@Query() query: any) {
    return this.adminService.getMicroActions(query);
  }

  @Post('micro-actions')
  createMicroAction(@Body() data: any, @Req() req: any) {
    return this.adminService.createMicroAction(data, req.userId);
  }

  @Patch('micro-actions/:id')
  updateMicroAction(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateMicroAction(id, data);
  }

  @Patch('micro-actions/:id/toggle')
  toggleMicroAction(@Param('id') id: string) {
    return this.adminService.toggleMicroAction(id);
  }

  @Get('dashboard-stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('feedback')
  getFeedback(@Query() query: any) {
    return this.adminService.getFeedback(query);
  }

  @Get('recommendation-logs')
  getRecommendationLogs(@Query() query: any) {
    return this.adminService.getRecommendationLogs(query);
  }
}

