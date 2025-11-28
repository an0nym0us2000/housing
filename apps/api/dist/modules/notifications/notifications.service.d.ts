import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
export declare enum NotificationType {
    LEAD_RECEIVED = "LEAD_RECEIVED",
    VISIT_CONFIRMED = "VISIT_CONFIRMED",
    VISIT_RESCHEDULED = "VISIT_RESCHEDULED",
    VISIT_CANCELLED = "VISIT_CANCELLED",
    VISIT_REMINDER = "VISIT_REMINDER",
    LISTING_APPROVED = "LISTING_APPROVED",
    LISTING_REJECTED = "LISTING_REJECTED",
    TASK_ASSIGNED = "TASK_ASSIGNED",
    TASK_REMINDER = "TASK_REMINDER",
    LEAD_ASSIGNED = "LEAD_ASSIGNED",
    WELCOME = "WELCOME"
}
export declare class NotificationsService {
    private prisma;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, emailService: EmailService);
    createNotification(data: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        link?: string;
        metadata?: any;
    }): Promise<any>;
    sendWelcomeEmail(user: {
        email: string;
        name: string;
        id: string;
    }): Promise<boolean>;
    sendNewLeadNotification(lead: any, listing: any, owner: any): Promise<boolean>;
    sendVisitConfirmation(visit: any, listing: any, visitor: any): Promise<boolean>;
    sendVisitReminder(visit: any, listing: any, hoursUntil: number): Promise<boolean>;
    sendTaskReminder(task: any, assignee: any): Promise<boolean>;
    sendListingApproved(listing: any, owner: any): Promise<boolean>;
    sendListingRejected(listing: any, owner: any, reason: string): Promise<boolean>;
    sendTaskAssigned(task: any, assignee: any, creator: any): Promise<void>;
    sendLeadAssigned(lead: any, assignee: any, assigner: any): Promise<void>;
    getUserNotifications(userId: string, unreadOnly?: boolean): Promise<any>;
    markAsRead(notificationId: string, userId: string): Promise<any>;
    markAllAsRead(userId: string): Promise<any>;
    getUnreadCount(userId: string): Promise<any>;
}
//# sourceMappingURL=notifications.service.d.ts.map