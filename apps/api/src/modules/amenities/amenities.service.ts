import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.amenity.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.amenity.findMany({
      where: { isActive: true, category },
      orderBy: { name: 'asc' },
    });
  }
}
