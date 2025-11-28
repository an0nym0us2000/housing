import { Controller, Get, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Get user's notifications
  @Get()
  async getUserNotifications(@Request() req: any, @Query('unreadOnly') unreadOnly?: string) {
    const userId = req.user.userId;
    const notifications = await this.notificationsService.getUserNotifications(
      userId,
      unreadOnly === 'true'
    );
    return {
      success: true,
      data: notifications,
    };
  }

  // Get unread count
  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const userId = req.user.userId;
    const count = await this.notificationsService.getUnreadCount(userId);
    return {
      success: true,
      data: { count },
    };
  }

  // Mark notification as read
  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string, @Request() req: any) {
    const userId = req.user.userId;
    await this.notificationsService.markAsRead(notificationId, userId);
    return {
      success: true,
      message: 'Notification marked as read',
    };
  }

  // Mark all notifications as read
  @Patch('mark-all-read')
  async markAllAsRead(@Request() req: any) {
    const userId = req.user.userId;
    await this.notificationsService.markAllAsRead(userId);
    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }
}
