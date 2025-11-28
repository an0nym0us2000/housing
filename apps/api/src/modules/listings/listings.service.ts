import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ListingStatus } from '@housing/database';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingDto } from './dto/query-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

  async create(userId: string, data: CreateListingDto) {
    const { amenityIds, ...listingData } = data;

    const listing = await this.prisma.listing.create({
      data: {
        ...listingData,
        userId,
        status: ListingStatus.DRAFT,
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

  async findAll(query: QueryListingDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply filters
    if (filters.listingType) where.listingType = filters.listingType;
    if (filters.propertyType) where.propertyType = filters.propertyType;
    if (filters.status) where.status = filters.status;
    if (filters.cityId) where.cityId = filters.cityId;
    if (filters.localityId) where.localityId = filters.localityId;
    if (filters.bhk) where.bhk = filters.bhk;

    // Price range filter
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
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

  async findOne(id: string) {
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
      throw new NotFoundException('Listing not found');
    }

    // Increment view count
    await this.prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return listing;
  }

  async update(id: string, userId: string, data: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
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

  async remove(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    await this.prisma.listing.delete({
      where: { id },
    });

    return { message: 'Listing deleted successfully' };
  }

  async submitForReview(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only submit your own listings');
    }

    if (listing.status !== ListingStatus.DRAFT) {
      throw new ForbiddenException('Only draft listings can be submitted for review');
    }

    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.UNDER_REVIEW },
    });
  }

  async getUserListings(userId: string, query: QueryListingDto) {
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

  // Admin methods
  async approveListing(id: string, moderatorId: string) {
    // Get listing with owner details
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
      throw new NotFoundException('Listing not found');
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: {
        status: ListingStatus.PUBLISHED,
        moderatedBy: moderatorId,
        moderatedAt: new Date(),
        publishedAt: new Date(),
      },
    });

    // Send approval notification (async, don't wait)
    this.notificationsService
      .sendListingApproved(listing, listing.user)
      .catch((error) => console.error('Failed to send listing approved notification:', error));

    return updatedListing;
  }

  async rejectListing(id: string, moderatorId: string, reason: string) {
    // Get listing with owner details
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
      throw new NotFoundException('Listing not found');
    }

    const updatedListing = await this.prisma.listing.update({
      where: { id },
      data: {
        status: ListingStatus.REJECTED,
        moderatedBy: moderatorId,
        moderatedAt: new Date(),
        rejectionReason: reason,
      },
    });

    // Send rejection notification (async, don't wait)
    this.notificationsService
      .sendListingRejected(listing, listing.user, reason)
      .catch((error) => console.error('Failed to send listing rejected notification:', error));

    return updatedListing;
  }
}
