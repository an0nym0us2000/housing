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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const database_1 = require("@housing/database");
let LeadsService = class LeadsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createLeadDto, userId) {
        const { listingId, ...leadData } = createLeadDto;
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
            throw new common_1.NotFoundException('Listing not found');
        }
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
        this.notificationsService
            .sendNewLeadNotification(lead, listing, listing.user)
            .catch((error) => console.error('Failed to send new lead notification:', error));
        return lead;
    }
    async getOwnerLeads(ownerId) {
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
    async getLeadsByListing(listingId, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only view leads for your own listings');
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
    async updateStatus(leadId, ownerId, updateDto) {
        const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
        });
        if (!lead) {
            throw new common_1.NotFoundException('Lead not found');
        }
        if (lead.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only update your own leads');
        }
        return this.prisma.lead.update({
            where: { id: leadId },
            data: { status: updateDto.status },
        });
    }
    async markAsRead(leadId, ownerId) {
        const lead = await this.prisma.lead.findUnique({
            where: { id: leadId },
        });
        if (!lead) {
            throw new common_1.NotFoundException('Lead not found');
        }
        if (lead.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only mark your own leads as read');
        }
        return this.prisma.lead.update({
            where: { id: leadId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async getLeadStats(userId) {
        const [total, newLeads, contacted, qualified] = await Promise.all([
            this.prisma.lead.count({ where: { ownerId: userId } }),
            this.prisma.lead.count({ where: { ownerId: userId, status: database_1.LeadStatus.NEW } }),
            this.prisma.lead.count({ where: { ownerId: userId, status: database_1.LeadStatus.CONTACTED } }),
            this.prisma.lead.count({ where: { ownerId: userId, status: database_1.LeadStatus.QUALIFIED } }),
        ]);
        return {
            total,
            new: newLeads,
            contacted,
            qualified,
        };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map