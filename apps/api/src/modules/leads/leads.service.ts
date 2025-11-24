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

  // Get lead details with activities
  async getLeadDetails(leadId: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            city: true,
            locality: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            city: true,
            locality: true,
          },
        },
        user: {
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
          },
        },
        assignments: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            assignedAt: 'desc',
          },
        },
        activities: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.ownerId !== userId) {
      throw new ForbiddenException('You can only view your own leads');
    }

    return lead;
  }

  // Add activity to a lead
  async addActivity(leadId: string, userId: string, data: any) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.ownerId !== userId) {
      throw new ForbiddenException('You can only add activities to your own leads');
    }

    return this.prisma.leadActivity.create({
      data: {
        ...data,
        leadId,
        userId,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
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

  // Get activities for a lead
  async getActivities(leadId: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.ownerId !== userId) {
      throw new ForbiddenException('You can only view activities for your own leads');
    }

    return this.prisma.leadActivity.findMany({
      where: { leadId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Delete activity
  async deleteActivity(activityId: string, userId: string) {
    const activity = await this.prisma.leadActivity.findUnique({
      where: { id: activityId },
      include: {
        lead: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.lead.ownerId !== userId) {
      throw new ForbiddenException('You can only delete activities from your own leads');
    }

    await this.prisma.leadActivity.delete({
      where: { id: activityId },
    });

    return { message: 'Activity deleted successfully' };
  }

  // Assign lead to a user
  async assignLead(leadId: string, assignerId: string, assigneeId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.ownerId !== assignerId) {
      throw new ForbiddenException('You can only assign your own leads');
    }

    const assignee = await this.prisma.user.findUnique({
      where: { id: assigneeId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!assignee) {
      throw new NotFoundException('Assignee user not found');
    }

    const assignment = await this.prisma.leadAssignment.create({
      data: {
        leadId,
        assignedToId: assigneeId,
        assignedById: assignerId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId,
        userId: assignerId,
        type: 'ASSIGNMENT',
        title: `Assigned to ${assignee.name}`,
        description: `Lead assigned to ${assignee.name} by ${lead.owner.name}`,
      },
    });

    this.notificationsService
      .sendLeadAssigned(lead, assignee, lead.owner)
      .catch((error) =>
        console.error('Failed to send lead assigned notification:', error),
      );

    return assignment;
  }

  async getAssignedLeads(userId: string) {
    return this.prisma.lead.findMany({
      where: {
        assignments: {
          some: {
            assignedToId: userId,
          },
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Update lead pipeline stage
  async updatePipelineStage(leadId: string, userId: string, pipelineStage: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    if (lead.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own leads');
    }

    const updatedLead = await this.prisma.lead.update({
      where: { id: leadId },
      data: { pipelineStage },
    });

    await this.prisma.leadActivity.create({
      data: {
        leadId,
        userId,
        type: 'STATUS_CHANGE',
        title: `Pipeline stage changed to ${pipelineStage}`,
        description: `Lead moved from ${lead.pipelineStage} to ${pipelineStage}`,
      },
    });

    return updatedLead;
  }

  // Get leads grouped by pipeline stage
  async getLeadsPipeline(userId: string) {
    const leads = await this.prisma.lead.findMany({
      where: { ownerId: userId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
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
      orderBy: [{ pipelineStage: 'asc' }, { createdAt: 'desc' }],
    });

    const grouped: any = {
      NEW: [],
      CONTACTED: [],
      QUALIFIED: [],
      SITE_VISIT_SCHEDULED: [],
      SITE_VISIT_COMPLETED: [],
      NEGOTIATION: [],
      DEAL_CLOSED: [],
      LOST: [],
    };

    leads.forEach((lead) => {
      if (grouped[lead.pipelineStage]) {
        grouped[lead.pipelineStage].push(lead);
      }
    });

    return grouped;
  }
}
