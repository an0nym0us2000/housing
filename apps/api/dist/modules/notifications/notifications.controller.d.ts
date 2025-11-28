import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(req: any, unreadOnly?: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getUnreadCount(req: any): Promise<{
        success: boolean;
        data: {
            count: any;
        };
    }>;
    markAsRead(notificationId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=notifications.controller.d.ts.map