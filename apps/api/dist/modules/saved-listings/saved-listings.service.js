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
exports.SavedListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SavedListingsService = class SavedListingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(userId, listingId) {
        const existing = await this.prisma.savedListing.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Listing already saved');
        }
        return this.prisma.savedListing.create({
            data: {
                userId,
                listingId,
            },
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
            },
        });
    }
    async unsave(userId, listingId) {
        await this.prisma.savedListing.delete({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });
        return { message: 'Listing removed from saved' };
    }
    async getUserSavedListings(userId) {
        return this.prisma.savedListing.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                listing: {
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
                },
            },
        });
    }
    async isSaved(userId, listingId) {
        const saved = await this.prisma.savedListing.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                },
            },
        });
        return { isSaved: !!saved };
    }
};
exports.SavedListingsService = SavedListingsService;
exports.SavedListingsService = SavedListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SavedListingsService);
//# sourceMappingURL=saved-listings.service.js.map