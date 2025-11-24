import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { VisitStatus } from '@housing/database';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // Run every hour to check for visit reminders
  @Cron(CronExpression.EVERY_HOUR)
  async sendVisitReminders() {
    this.logger.log('Checking for upcoming visits...');

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
    const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000);

    // Find confirmed visits in the next 24 hours that haven't been reminded
    const upcomingVisits = await this.prisma.visit.findMany({
      where: {
        status: VisitStatus.CONFIRMED,
        scheduledAt: {
          gte: now,
          lte: in24Hours,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            locality: true,
          },
        },
        visitor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    this.logger.log(`Found ${upcomingVisits.length} upcoming visits`);

    for (const visit of upcomingVisits) {
      const timeUntilVisit = visit.scheduledAt.getTime() - now.getTime();
      const hoursUntilVisit = timeUntilVisit / (1000 * 60 * 60);

      // Send 24-hour reminder
      if (hoursUntilVisit <= 24 && hoursUntilVisit > 23) {
        this.logger.log(`Sending 24h reminder for visit ${visit.id}`);
        await this.notificationsService.sendVisitReminder(
          visit,
          visit.listing,
          24,
        );
      }

      // Send 1-hour reminder
      if (hoursUntilVisit <= 1 && hoursUntilVisit > 0.5) {
        this.logger.log(`Sending 1h reminder for visit ${visit.id}`);
        await this.notificationsService.sendVisitReminder(
          visit,
          visit.listing,
          1,
        );
      }
    }
  }

  // Run every day at 9 AM to check for overdue tasks
  @Cron('0 9 * * *')
  async sendTaskReminders() {
    this.logger.log('Checking for overdue tasks...');

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find overdue tasks
    const overdueTasks = await this.prisma.task.findMany({
      where: {
        status: {
          in: ['TODO', 'IN_PROGRESS'],
        },
        dueDate: {
          lte: now,
          gte: yesterday, // Only tasks due in last 24 hours to avoid spam
        },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Found ${overdueTasks.length} overdue tasks`);

    for (const task of overdueTasks) {
      this.logger.log(`Sending reminder for task ${task.id} to ${task.assignedTo.email}`);
      await this.notificationsService.sendTaskReminder(task, task.assignedTo);
    }
  }

  // Run every day at 8 AM to check for tasks due today
  @Cron('0 8 * * *')
  async sendTaskDueTodayReminders() {
    this.logger.log('Checking for tasks due today...');

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Find tasks due today
    const tasksDueToday = await this.prisma.task.findMany({
      where: {
        status: {
          in: ['TODO', 'IN_PROGRESS'],
        },
        dueDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Found ${tasksDueToday.length} tasks due today`);

    for (const task of tasksDueToday) {
      this.logger.log(`Sending due-today reminder for task ${task.id}`);
      await this.notificationsService.sendTaskReminder(task, task.assignedTo);
    }
  }
}
