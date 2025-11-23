import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LeadStatus } from '@housing/database';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(createLeadDto: CreateLeadDto, userId?: string) {
    const { listingId, ...leadData } = createLeadDto;

    // Get listing to find the owner
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        price: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Increment contact count
    await this.prisma.listing.update({
      where: { id: listingId },
      data: { contactCount: { increment: 1 } },
    });

    const lead = await this.prisma.lead.create({
      data: {
        ...leadData,
        listingId,
        userId,
        ownerId: listing.userId,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    // Send new lead notification (async, don't wait)
    this.notificationsService
      .sendNewLeadNotification(lead, listing, listing.user)
      .catch((error) => console.error('Failed to send new lead notification:', error));

    return lead;
  }

  async getOwnerLeads(ownerId: string) {
    return this.prisma.lead.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            propertyType: true,
            listingType: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getLeadsByListing(listingId: string, userId: string) {
    // Verify user owns the listing
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only view leads for your own listings');
    }

    return this.prisma.lead.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateStatus(leadId: string, ownerId: string, updateDto: UpdateLeadStatusDto) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.ownerId !== ownerId) {
      throw new ForbiddenException('You can only update your own leads');
    }

    return this.prisma.lead.update({
      where: { id: leadId },
      data: { status: updateDto.status },
    });
  }

  async markAsRead(leadId: string, ownerId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.ownerId !== ownerId) {
      throw new ForbiddenException('You can only mark your own leads as read');
    }

    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getLeadStats(userId: string) {
    const [total, newLeads, contacted, qualified] = await Promise.all([
      this.prisma.lead.count({ where: { ownerId: userId } }),
      this.prisma.lead.count({ where: { ownerId: userId, status: LeadStatus.NEW } }),
      this.prisma.lead.count({ where: { ownerId: userId, status: LeadStatus.CONTACTED } }),
      this.prisma.lead.count({ where: { ownerId: userId, status: LeadStatus.QUALIFIED } }),
    ]);

    return {
      total,
      new: newLeads,
      contacted,
      qualified,
    };
  }
}
