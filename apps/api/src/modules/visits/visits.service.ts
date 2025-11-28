import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { VisitStatus } from '@housing/database';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { QueryVisitDto } from './dto/query-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(userId: string, data: CreateVisitDto) {
    // Get listing to check ownership
    const listing = await this.prisma.listing.findUnique({
      where: { id: data.listingId },
      select: { id: true, userId: true, status: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== 'PUBLISHED') {
      throw new BadRequestException('Can only schedule visits for published listings');
    }

    // Check if visit time is in the future
    const scheduledAt = new Date(data.scheduledAt);
    if (scheduledAt <= new Date()) {
      throw new BadRequestException('Visit must be scheduled for a future date');
    }

    // Create visit
    const visit = await this.prisma.visit.create({
      data: {
        ...data,
        scheduledAt,
        visitorId: userId,
        ownerId: listing.userId,
        status: VisitStatus.REQUESTED,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
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
      },
    });

    // TODO: Create notification for owner
    // await this.createNotification(listing.userId, 'VISIT_REQUESTED', visit.id);

    return visit;
  }

  async findAll(query: QueryVisitDto) {
    const { page = 1, limit = 20, sortBy = 'scheduledAt', sortOrder = 'desc', ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.listingId) where.listingId = filters.listingId;

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              city: true,
              locality: true,
            },
          },
          visitor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.visit.count({ where }),
    ]);

    return {
      data: visits,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            city: true,
            locality: true,
            media: {
              orderBy: { displayOrder: 'asc' },
              take: 1,
            },
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

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    return visit;
  }

  async getMyVisitsAsVisitor(userId: string, query: QueryVisitDto) {
    const { page = 1, limit = 20, sortBy = 'scheduledAt', sortOrder = 'desc', ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = { visitorId: userId };

    if (filters.status) where.status = filters.status;
    if (filters.listingId) where.listingId = filters.listingId;

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              city: true,
              locality: true,
              media: {
                orderBy: { displayOrder: 'asc' },
                take: 1,
              },
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.visit.count({ where }),
    ]);

    return {
      data: visits,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMyVisitsAsOwner(userId: string, query: QueryVisitDto) {
    const { page = 1, limit = 20, sortBy = 'scheduledAt', sortOrder = 'desc', ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = { ownerId: userId };

    if (filters.status) where.status = filters.status;
    if (filters.listingId) where.listingId = filters.listingId;

    const [visits, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
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
        },
      }),
      this.prisma.visit.count({ where }),
    ]);

    return {
      data: visits,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async confirmVisit(id: string, userId: string, data: UpdateVisitDto) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      select: { id: true, ownerId: true, status: true },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.ownerId !== userId) {
      throw new ForbiddenException('Only the property owner can confirm visits');
    }

    if (visit.status !== VisitStatus.REQUESTED) {
      throw new BadRequestException('Only requested visits can be confirmed');
    }

    const updatedVisit = await this.prisma.visit.update({
      where: { id },
      data: {
        status: VisitStatus.CONFIRMED,
        confirmedAt: new Date(),
        confirmedBy: userId,
        ownerNotes: data.ownerNotes,
      },
      include: {
        listing: true,
        visitor: true,
      },
    });

    // Send visit confirmation notification (async, don't wait)
    this.notificationsService
      .sendVisitConfirmation(updatedVisit, updatedVisit.listing, updatedVisit.visitor)
      .catch((error) => console.error('Failed to send visit confirmation notification:', error));

    return updatedVisit;
  }

  async rescheduleVisit(id: string, userId: string, data: UpdateVisitDto) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      select: { id: true, ownerId: true, visitorId: true, scheduledAt: true, status: true },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    // Both owner and visitor can reschedule
    if (visit.ownerId !== userId && visit.visitorId !== userId) {
      throw new ForbiddenException('You can only reschedule your own visits');
    }

    if (!data.scheduledAt) {
      throw new BadRequestException('New scheduled time is required for rescheduling');
    }

    const newScheduledAt = new Date(data.scheduledAt);
    if (newScheduledAt <= new Date()) {
      throw new BadRequestException('Visit must be scheduled for a future date');
    }

    const updatedVisit = await this.prisma.visit.update({
      where: { id },
      data: {
        scheduledAt: newScheduledAt,
        originalScheduledAt: visit.scheduledAt,
        rescheduledReason: data.rescheduledReason,
        status: VisitStatus.RESCHEDULED,
      },
      include: {
        listing: true,
        visitor: true,
        owner: true,
      },
    });

    // TODO: Create notification for the other party
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _notifyUserId = visit.ownerId === userId ? visit.visitorId : visit.ownerId;
    // await this.createNotification(_notifyUserId, 'VISIT_RESCHEDULED', visit.id);

    return updatedVisit;
  }

  async cancelVisit(id: string, userId: string, data: UpdateVisitDto) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      select: { id: true, ownerId: true, visitorId: true, status: true },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    // Both owner and visitor can cancel
    if (visit.ownerId !== userId && visit.visitorId !== userId) {
      throw new ForbiddenException('You can only cancel your own visits');
    }

    const updatedVisit = await this.prisma.visit.update({
      where: { id },
      data: {
        status: VisitStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledBy: userId,
        cancellationReason: data.cancellationReason,
      },
      include: {
        listing: true,
        visitor: true,
        owner: true,
      },
    });

    // TODO: Create notification for the other party
    const notifyUserId = visit.ownerId === userId ? visit.visitorId : visit.ownerId;
    // await this.createNotification(notifyUserId, 'VISIT_CANCELLED', visit.id);

    return updatedVisit;
  }

  async completeVisit(id: string, userId: string, data: UpdateVisitDto) {
    const visit = await this.prisma.visit.findUnique({
      where: { id },
      select: { id: true, visitorId: true, status: true },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.visitorId !== userId) {
      throw new ForbiddenException('Only the visitor can mark visit as complete');
    }

    if (visit.status !== VisitStatus.CONFIRMED && visit.status !== VisitStatus.RESCHEDULED) {
      throw new BadRequestException('Only confirmed visits can be completed');
    }

    return this.prisma.visit.update({
      where: { id },
      data: {
        status: VisitStatus.COMPLETED,
        completedAt: new Date(),
        feedback: data.feedback,
        rating: data.rating,
      },
    });
  }

  async getVisitStats(userId: string) {
    const [asVisitor, asOwner] = await Promise.all([
      this.prisma.visit.count({ where: { visitorId: userId } }),
      this.prisma.visit.count({ where: { ownerId: userId } }),
    ]);

    const [requestedAsOwner, confirmedAsOwner, upcomingAsVisitor] = await Promise.all([
      this.prisma.visit.count({
        where: { ownerId: userId, status: VisitStatus.REQUESTED },
      }),
      this.prisma.visit.count({
        where: { ownerId: userId, status: VisitStatus.CONFIRMED },
      }),
      this.prisma.visit.count({
        where: {
          visitorId: userId,
          status: { in: [VisitStatus.CONFIRMED, VisitStatus.RESCHEDULED] },
          scheduledAt: { gte: new Date() },
        },
      }),
    ]);

    return {
      asVisitor,
      asOwner,
      requestedAsOwner,
      confirmedAsOwner,
      upcomingAsVisitor,
    };
  }
}
