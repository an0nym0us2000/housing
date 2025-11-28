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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const database_1 = require("@housing/database");
let ListingsService = class ListingsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(userId, data) {
        const { amenityIds, ...listingData } = data;
        const listing = await this.prisma.listing.create({
            data: {
                ...listingData,
                userId,
                status: database_1.ListingStatus.DRAFT,
                amenities: amenityIds
                    ? {
                        create: amenityIds.map((amenityId) => ({
                            amenity: { connect: { id: amenityId } },
                        })),
                    }
                    : undefined,
            },
            include: {
                city: true,
                locality: true,
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
                media: true,
            },
        });
        return listing;
    }
    async findAll(query) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.listingType)
            where.listingType = filters.listingType;
        if (filters.propertyType)
            where.propertyType = filters.propertyType;
        if (filters.status)
            where.status = filters.status;
        if (filters.cityId)
            where.cityId = filters.cityId;
        if (filters.localityId)
            where.localityId = filters.localityId;
        if (filters.bhk)
            where.bhk = filters.bhk;
        if (filters.minPrice || filters.maxPrice) {
            where.price = {};
            if (filters.minPrice)
                where.price.gte = filters.minPrice;
            if (filters.maxPrice)
                where.price.lte = filters.maxPrice;
        }
        const [listings, total] = await Promise.all([
            this.prisma.listing.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    city: true,
                    locality: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                        },
                    },
                    media: {
                        orderBy: { displayOrder: 'asc' },
                        take: 1,
                    },
                    amenities: {
                        include: {
                            amenity: true,
                        },
                    },
                },
            }),
            this.prisma.listing.count({ where }),
        ]);
        return {
            data: listings,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                city: true,
                locality: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true,
                    },
                },
                media: {
                    orderBy: { displayOrder: 'asc' },
                },
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        await this.prisma.listing.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        return listing;
    }
    async update(id, userId, data) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own listings');
        }
        const { amenityIds, ...updateData } = data;
        return this.prisma.listing.update({
            where: { id },
            data: {
                ...updateData,
                amenities: amenityIds
                    ? {
                        deleteMany: {},
                        create: amenityIds.map((amenityId) => ({
                            amenity: { connect: { id: amenityId } },
                        })),
                    }
                    : undefined,
            },
            include: {
                city: true,
                locality: true,
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
                media: true,
            },
        });
    }
    async remove(id, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own listings');
        }
        await this.prisma.listing.delete({
            where: { id },
        });
        return { message: 'Listing deleted successfully' };
    }
    async submitForReview(id, userId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only submit your own listings');
        }
        if (listing.status !== database_1.ListingStatus.DRAFT) {
            throw new common_1.ForbiddenException('Only draft listings can be submitted for review');
        }
        return this.prisma.listing.update({
            where: { id },
            data: { status: database_1.ListingStatus.UNDER_REVIEW },
        });
    }
    async getUserListings(userId, query) {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const [listings, total] = await Promise.all([
            this.prisma.listing.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    city: true,
                    locality: true,
                    media: {
                        orderBy: { displayOrder: 'asc' },
                        take: 1,
                    },
                    amenities: {
                        include: {
                            amenity: true,
                        },
                    },
                    _count: {
                        select: {
                            leads: true,
                        },
                    },
                },
            }),
            this.prisma.listing.count({ where: { userId } }),
        ]);
        return {
            data: listings,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async approveListing(id, moderatorId) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
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
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: {
                status: database_1.ListingStatus.PUBLISHED,
                moderatedBy: moderatorId,
                moderatedAt: new Date(),
                publishedAt: new Date(),
            },
        });
        this.notificationsService
            .sendListingApproved(listing, listing.user)
            .catch((error) => console.error('Failed to send listing approved notification:', error));
        return updatedListing;
    }
    async rejectListing(id, moderatorId, reason) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
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
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: {
                status: database_1.ListingStatus.REJECTED,
                moderatedBy: moderatorId,
                moderatedAt: new Date(),
                rejectionReason: reason,
            },
        });
        this.notificationsService
            .sendListingRejected(listing, listing.user, reason)
            .catch((error) => console.error('Failed to send listing rejected notification:', error));
        return updatedListing;
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map