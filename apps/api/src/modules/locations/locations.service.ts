import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async getCities() {
    return this.prisma.city.findMany({
      where: { isActive: true },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        state: true,
        country: true,
        latitude: true,
        longitude: true,
      },
    });
  }

  async getCity(id: string) {
    return this.prisma.city.findUnique({
      where: { id },
      include: {
        localities: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async getLocalities(cityId: string) {
    return this.prisma.locality.findMany({
      where: { cityId, isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        cityId: true,
        pincode: true,
        latitude: true,
        longitude: true,
      },
    });
  }

  async searchCities(query: string) {
    return this.prisma.city.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { state: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      take: 10,
    });
  }

  async searchLocalities(cityId: string, query: string) {
    return this.prisma.locality.findMany({
      where: {
        cityId,
        isActive: true,
        name: { contains: query, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
      take: 20,
    });
  }
}
