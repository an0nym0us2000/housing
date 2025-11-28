"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = exports.NotificationType = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("./email.service");
var NotificationType;
(function (NotificationType) {
    NotificationType["LEAD_RECEIVED"] = "LEAD_RECEIVED";
    NotificationType["VISIT_CONFIRMED"] = "VISIT_CONFIRMED";
    NotificationType["VISIT_RESCHEDULED"] = "VISIT_RESCHEDULED";
    NotificationType["VISIT_CANCELLED"] = "VISIT_CANCELLED";
    NotificationType["VISIT_REMINDER"] = "VISIT_REMINDER";
    NotificationType["LISTING_APPROVED"] = "LISTING_APPROVED";
    NotificationType["LISTING_REJECTED"] = "LISTING_REJECTED";
    NotificationType["TASK_ASSIGNED"] = "TASK_ASSIGNED";
    NotificationType["TASK_REMINDER"] = "TASK_REMINDER";
    NotificationType["LEAD_ASSIGNED"] = "LEAD_ASSIGNED";
    NotificationType["WELCOME"] = "WELCOME";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async createNotification(data) {
        try {
            return await this.prisma.notification.create({
                data: {
                    userId: data.userId,
                    type: data.type,
                    title: data.title,
                    message: data.message,
                    link: data.link,
                    metadata: data.metadata,
                },
            });
        }
        catch (error) {
            this.logger.error('Failed to create notification:', error);
            return null;
        }
    }
    async sendWelcomeEmail(user) {
        const html = this.emailService.getWelcomeEmailHtml(user.name);
        const sent = await this.emailService.sendEmail({
            to: user.email,
            subject: 'Welcome to Housing Platform!',
            html,
        });
        if (sent) {
            await this.createNotification({
                userId: user.id,
                type: NotificationType.WELCOME,
                title: 'Welcome to Housing Platform!',
                message: 'Thank you for joining us. Start exploring properties now.',
                link: '/',
            });
        }
        return sent;
    }
    async sendNewLeadNotification(lead, listing, owner) {
        const html = this.emailService.getNewLeadEmailHtml(lead, listing);
        const sent = await this.emailService.sendEmail({
            to: owner.email,
            subject: `New Lead for ${listing.title}`,
            html,
        });
        if (sent) {
            await this.createNotification({
                userId: owner.id,
                type: NotificationType.LEAD_RECEIVED,
                title: 'New Lead Received!',
                message: `${lead.name} is interested in ${listing.title}`,
                link: `/dashboard`,
                metadata: { leadId: lead.id, listingId: listing.id },
            });
        }
        return sent;
    }
    async sendVisitConfirmation(visit, listing, visitor) {
        const html = this.emailService.getVisitConfirmationEmailHtml(visit, listing);
        const sent = await this.emailService.sendEmail({
            to: visitor.email || visit.visitorEmail,
            subject: `Visit Confirmed for ${listing.title}`,
            html,
        });
        if (sent && visitor.id) {
            await this.createNotification({
                userId: visitor.id,
                type: NotificationType.VISIT_CONFIRMED,
                title: 'Visit Confirmed!',
                message: `Your visit to ${listing.title} has been confirmed`,
                link: `/dashboard`,
                metadata: { visitId: visit.id, listingId: listing.id },
            });
        }
        return sent;
    }
    async sendVisitReminder(visit, listing, hoursUntil) {
        const email = visit.visitor?.email || visit.visitorEmail;
        if (!email)
            return false;
        const html = this.emailService.getVisitReminderEmailHtml(visit, listing, hoursUntil);
        const sent = await this.emailService.sendEmail({
            to: email,
            subject: `Reminder: Visit to ${listing.title} in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}`,
            html,
        });
        if (sent && visit.visitor?.id) {
            await this.createNotification({
                userId: visit.visitor.id,
                type: NotificationType.VISIT_REMINDER,
                title: `Visit Reminder - ${hoursUntil}h`,
                message: `Your visit to ${listing.title} is coming up soon`,
                link: `/dashboard`,
                metadata: { visitId: visit.id, listingId: listing.id },
            });
        }
        return sent;
    }
    async sendTaskReminder(task, assignee) {
        const html = this.emailService.getTaskReminderEmailHtml(task);
        const sent = await this.emailService.sendEmail({
            to: assignee.email,
            subject: `Task Reminder: ${task.title}`,
            html,
        });
        if (sent) {
            await this.createNotification({
                userId: assignee.id,
                type: NotificationType.TASK_REMINDER,
                title: 'Task Reminder',
                message: `Task "${task.title}" requires your attention`,
                link: `/tasks`,
                metadata: { taskId: task.id },
            });
        }
        return sent;
    }
    async sendListingApproved(listing, owner) {
        const html = this.emailService.getListingApprovedEmailHtml(listing);
        const sent = await this.emailService.sendEmail({
            to: owner.email,
            subject: `Your Listing "${listing.title}" is Now Live!`,
            html,
        });
        if (sent) {
            await this.createNotification({
                userId: owner.id,
                type: NotificationType.LISTING_APPROVED,
                title: 'Listing Approved!',
                message: `Your listing "${listing.title}" is now live`,
                link: `/listings/${listing.id}`,
                metadata: { listingId: listing.id },
            });
        }
        return sent;
    }
    async sendListingRejected(listing, owner, reason) {
        const html = this.emailService.getListingRejectedEmailHtml(listing, reason);
        const sent = await this.emailService.sendEmail({
            to: owner.email,
            subject: `Action Required: Update Your Listing "${listing.title}"`,
            html,
        });
        if (sent) {
            await this.createNotification({
                userId: owner.id,
                type: NotificationType.LISTING_REJECTED,
                title: 'Listing Needs Updates',
                message: `Your listing "${listing.title}" requires modifications`,
                link: `/dashboard`,
                metadata: { listingId: listing.id, reason },
            });
        }
        return sent;
    }
    async sendTaskAssigned(task, assignee, creator) {
        await this.createNotification({
            userId: assignee.id,
            type: NotificationType.TASK_ASSIGNED,
            title: 'New Task Assigned',
            message: `${creator.name} assigned you: ${task.title}`,
            link: `/tasks`,
            metadata: { taskId: task.id },
        });
    }
    async sendLeadAssigned(lead, assignee, assigner) {
        await this.createNotification({
            userId: assignee.id,
            type: NotificationType.LEAD_ASSIGNED,
            title: 'New Lead Assigned',
            message: `${assigner.name} assigned you a lead: ${lead.name}`,
            link: `/leads/${lead.id}`,
            metadata: { leadId: lead.id },
        });
    }
    async getUserNotifications(userId, unreadOnly = false) {
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly && { isRead: false }),
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });
    }
    async markAsRead(notificationId, userId) {
        return this.prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map