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
exports.VisitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const database_1 = require("@housing/database");
let VisitsService = class VisitsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, data) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: data.listingId },
            select: { id: true, userId: true, status: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.status !== 'PUBLISHED') {
            throw new common_1.BadRequestException('Can only schedule visits for published listings');
        }
        const scheduledAt = new Date(data.scheduledAt);
        if (scheduledAt <= new Date()) {
            throw new common_1.BadRequestException('Visit must be scheduled for a future date');
        }
        const visit = await this.prisma.visit.create({
            data: {
                ...data,
                scheduledAt,
                visitorId: userId,
                ownerId: listing.userId,
                status: database_1.VisitStatus.REQUESTED,
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
        return visit;
    }
    async findAll(query) {
        const { page = 1, limit = 20, sortBy = 'scheduledAt', sortOrder = 'desc', ...filters } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.listingId)
            where.listingId = filters.listingId;
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Visit not found');
        }
        return visit;
    }
    async getMyVisitsAsVisitor(userId, query) {
        const { page = 1, limit = 20, sortBy = 'scheduledAt', sortOrder = 'desc', ...filters } = query;
        const skip = (page - 1) * limit;
        const where = { visitorId: userId };
        if (filters.status)
            where.status = filters.status;
        if (filters.listingId)
            where.listingId = filters.listingId;
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
    async getMyVisitsAsOwner(userId, query) {
        const { page = 1, limit = 20, sortBy = 'scheduledAt', sortOrder = 'desc', ...filters } = query;
        const skip = (page - 1) * limit;
        const where = { ownerId: userId };
        if (filters.status)
            where.status = filters.status;
        if (filters.listingId)
            where.listingId = filters.listingId;
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
    async confirmVisit(id, userId, data) {
        const visit = await this.prisma.visit.findUnique({
            where: { id },
            select: { id: true, ownerId: true, status: true },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        if (visit.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only the property owner can confirm visits');
        }
        if (visit.status !== database_1.VisitStatus.REQUESTED) {
            throw new common_1.BadRequestException('Only requested visits can be confirmed');
        }
        const updatedVisit = await this.prisma.visit.update({
            where: { id },
            data: {
                status: database_1.VisitStatus.CONFIRMED,
                confirmedAt: new Date(),
                confirmedBy: userId,
                ownerNotes: data.ownerNotes,
            },
            include: {
                listing: true,
                visitor: true,
            },
        });
        this.notificationsService
            .sendVisitConfirmation(updatedVisit, updatedVisit.listing, updatedVisit.visitor)
            .catch((error) => console.error('Failed to send visit confirmation notification:', error));
        return updatedVisit;
    }
    async rescheduleVisit(id, userId, data) {
        const visit = await this.prisma.visit.findUnique({
            where: { id },
            select: { id: true, ownerId: true, visitorId: true, scheduledAt: true, status: true },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        if (visit.ownerId !== userId && visit.visitorId !== userId) {
            throw new common_1.ForbiddenException('You can only reschedule your own visits');
        }
        if (!data.scheduledAt) {
            throw new common_1.BadRequestException('New scheduled time is required for rescheduling');
        }
        const newScheduledAt = new Date(data.scheduledAt);
        if (newScheduledAt <= new Date()) {
            throw new common_1.BadRequestException('Visit must be scheduled for a future date');
        }
        const updatedVisit = await this.prisma.visit.update({
            where: { id },
            data: {
                scheduledAt: newScheduledAt,
                originalScheduledAt: visit.scheduledAt,
                rescheduledReason: data.rescheduledReason,
                status: database_1.VisitStatus.RESCHEDULED,
            },
            include: {
                listing: true,
                visitor: true,
                owner: true,
            },
        });
        const notifyUserId = visit.ownerId === userId ? visit.visitorId : visit.ownerId;
        return updatedVisit;
    }
    async cancelVisit(id, userId, data) {
        const visit = await this.prisma.visit.findUnique({
            where: { id },
            select: { id: true, ownerId: true, visitorId: true, status: true },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        if (visit.ownerId !== userId && visit.visitorId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own visits');
        }
        const updatedVisit = await this.prisma.visit.update({
            where: { id },
            data: {
                status: database_1.VisitStatus.CANCELLED,
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
        const notifyUserId = visit.ownerId === userId ? visit.visitorId : visit.ownerId;
        return updatedVisit;
    }
    async completeVisit(id, userId, data) {
        const visit = await this.prisma.visit.findUnique({
            where: { id },
            select: { id: true, visitorId: true, status: true },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        if (visit.visitorId !== userId) {
            throw new common_1.ForbiddenException('Only the visitor can mark visit as complete');
        }
        if (visit.status !== database_1.VisitStatus.CONFIRMED && visit.status !== database_1.VisitStatus.RESCHEDULED) {
            throw new common_1.BadRequestException('Only confirmed visits can be completed');
        }
        return this.prisma.visit.update({
            where: { id },
            data: {
                status: database_1.VisitStatus.COMPLETED,
                completedAt: new Date(),
                feedback: data.feedback,
                rating: data.rating,
            },
        });
    }
    async getVisitStats(userId) {
        const [asVisitor, asOwner] = await Promise.all([
            this.prisma.visit.count({ where: { visitorId: userId } }),
            this.prisma.visit.count({ where: { ownerId: userId } }),
        ]);
        const [requestedAsOwner, confirmedAsOwner, upcomingAsVisitor] = await Promise.all([
            this.prisma.visit.count({
                where: { ownerId: userId, status: database_1.VisitStatus.REQUESTED },
            }),
            this.prisma.visit.count({
                where: { ownerId: userId, status: database_1.VisitStatus.CONFIRMED },
            }),
            this.prisma.visit.count({
                where: {
                    visitorId: userId,
                    status: { in: [database_1.VisitStatus.CONFIRMED, database_1.VisitStatus.RESCHEDULED] },
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
};
exports.VisitsService = VisitsService;
exports.VisitsService = VisitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], VisitsService);
//# sourceMappingURL=visits.service.js.map