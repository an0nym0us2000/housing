import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavedListingsService {
  constructor(private prisma: PrismaService) {}

  async save(userId: string, listingId: string) {
    // Check if already saved
    const existing = await this.prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Listing already saved');
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

  async unsave(userId: string, listingId: string) {
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

  async getUserSavedListings(userId: string) {
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

  async isSaved(userId: string, listingId: string) {
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
}
