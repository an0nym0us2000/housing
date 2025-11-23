import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';

export enum NotificationType {
  LEAD_RECEIVED = 'LEAD_RECEIVED',
  VISIT_CONFIRMED = 'VISIT_CONFIRMED',
  VISIT_RESCHEDULED = 'VISIT_RESCHEDULED',
  VISIT_CANCELLED = 'VISIT_CANCELLED',
  VISIT_REMINDER = 'VISIT_REMINDER',
  LISTING_APPROVED = 'LISTING_APPROVED',
  LISTING_REJECTED = 'LISTING_REJECTED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_REMINDER = 'TASK_REMINDER',
  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
  WELCOME = 'WELCOME',
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) {}

  // Create in-app notification
  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    metadata?: any;
  }) {
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
    } catch (error) {
      this.logger.error('Failed to create notification:', error);
      return null;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user: { email: string; name: string; id: string }) {
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

  // Send new lead notification
  async sendNewLeadNotification(lead: any, listing: any, owner: any) {
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

  // Send visit confirmation
  async sendVisitConfirmation(visit: any, listing: any, visitor: any) {
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

  // Send visit reminder
  async sendVisitReminder(visit: any, listing: any, hoursUntil: number) {
    const email = visit.visitor?.email || visit.visitorEmail;
    if (!email) return false;

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

  // Send task reminder
  async sendTaskReminder(task: any, assignee: any) {
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

  // Send listing approved notification
  async sendListingApproved(listing: any, owner: any) {
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

  // Send listing rejected notification
  async sendListingRejected(listing: any, owner: any, reason: string) {
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

  // Send task assigned notification
  async sendTaskAssigned(task: any, assignee: any, creator: any) {
    await this.createNotification({
      userId: assignee.id,
      type: NotificationType.TASK_ASSIGNED,
      title: 'New Task Assigned',
      message: `${creator.name} assigned you: ${task.title}`,
      link: `/tasks`,
      metadata: { taskId: task.id },
    });
  }

  // Send lead assigned notification
  async sendLeadAssigned(lead: any, assignee: any, assigner: any) {
    await this.createNotification({
      userId: assignee.id,
      type: NotificationType.LEAD_ASSIGNED,
      title: 'New Lead Assigned',
      message: `${assigner.name} assigned you a lead: ${lead.name}`,
      link: `/leads/${lead.id}`,
      metadata: { leadId: lead.id },
    });
  }

  // Get user notifications
  async getUserNotifications(userId: string, unreadOnly = false) {
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

  // Mark notification as read
  async markAsRead(notificationId: string, userId: string) {
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

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
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

  // Get unread count
  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}
