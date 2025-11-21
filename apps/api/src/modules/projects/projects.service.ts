import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTowerDto } from './dto/create-tower.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { BulkCreateUnitsDto } from './dto/bulk-create-units.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    // Verify user is a builder
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'BUILDER') {
      throw new ForbiddenException('Only builders can create projects');
    }

    // Generate slug from name
    const slug = createProjectDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check slug uniqueness
    const existing = await this.prisma.project.findUnique({
      where: { slug },
    });

    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        launchDate: createProjectDto.launchDate
          ? new Date(createProjectDto.launchDate)
          : null,
        possessionDate: createProjectDto.possessionDate
          ? new Date(createProjectDto.possessionDate)
          : null,
        slug: finalSlug,
        builderId: userId,
        moderationStatus: 'PENDING',
      },
      include: {
        city: true,
        locality: true,
        builder: {
          select: {
            id: true,
            name: true,
            email: true,
            builderCompany: true,
          },
        },
      },
    });

    return project;
  }

  async findAll(query?: any) {
    const where: any = {
      isPublished: true,
      isActive: true,
      moderationStatus: 'APPROVED',
    };

    if (query?.cityId) {
      where.cityId = query.cityId;
    }

    if (query?.projectType) {
      where.projectType = query.projectType;
    }

    if (query?.projectStatus) {
      where.projectStatus = query.projectStatus;
    }

    const projects = await this.prisma.project.findMany({
      where,
      include: {
        city: true,
        locality: true,
        builder: {
          select: {
            id: true,
            name: true,
            builderCompany: true,
          },
        },
        _count: {
          select: {
            units: true,
            towers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects;
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        city: true,
        locality: true,
        builder: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            builderCompany: true,
            establishedYear: true,
          },
        },
        towers: {
          include: {
            _count: {
              select: {
                units: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        _count: {
          select: {
            units: true,
            towers: true,
            leads: true,
            campaigns: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        city: true,
        locality: true,
        builder: {
          select: {
            id: true,
            name: true,
            phone: true,
            builderCompany: true,
            establishedYear: true,
          },
        },
        towers: {
          include: {
            _count: {
              select: {
                units: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        _count: {
          select: {
            units: true,
            towers: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async getMyProjects(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        builderId: userId,
      },
      include: {
        city: true,
        locality: true,
        _count: {
          select: {
            units: true,
            towers: true,
            leads: true,
            campaigns: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects;
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { builderId: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.builderId !== userId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...updateProjectDto,
        launchDate: updateProjectDto.launchDate
          ? new Date(updateProjectDto.launchDate)
          : undefined,
        possessionDate: updateProjectDto.possessionDate
          ? new Date(updateProjectDto.possessionDate)
          : undefined,
      },
      include: {
        city: true,
        locality: true,
        builder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { builderId: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.builderId !== userId) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return { message: 'Project deleted successfully' };
  }

  // Tower Management
  async createTower(projectId: string, userId: string, createTowerDto: CreateTowerDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { builderId: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.builderId !== userId) {
      throw new ForbiddenException('You can only add towers to your own projects');
    }

    const tower = await this.prisma.tower.create({
      data: {
        ...createTowerDto,
        projectId,
      },
    });

    return tower;
  }

  async getTowers(projectId: string) {
    const towers = await this.prisma.tower.findMany({
      where: { projectId },
      include: {
        _count: {
          select: {
            units: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return towers;
  }

  // Unit Management
  async createUnit(projectId: string, userId: string, createUnitDto: CreateUnitDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { builderId: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.builderId !== userId) {
      throw new ForbiddenException('You can only add units to your own projects');
    }

    // Check if unit number already exists
    const existing = await this.prisma.unit.findUnique({
      where: {
        projectId_unitNumber: {
          projectId,
          unitNumber: createUnitDto.unitNumber,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Unit number already exists in this project');
    }

    const unit = await this.prisma.unit.create({
      data: {
        ...createUnitDto,
        projectId,
      },
      include: {
        tower: true,
      },
    });

    return unit;
  }

  async bulkCreateUnits(projectId: string, userId: string, bulkCreateUnitsDto: BulkCreateUnitsDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { builderId: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.builderId !== userId) {
      throw new ForbiddenException('You can only add units to your own projects');
    }

    const createdUnits = await this.prisma.$transaction(
      bulkCreateUnitsDto.units.map((unit) =>
        this.prisma.unit.create({
          data: {
            ...unit,
            projectId,
          },
        }),
      ),
    );

    return {
      message: `Successfully created ${createdUnits.length} units`,
      units: createdUnits,
    };
  }

  async getUnits(projectId: string, query?: any) {
    const where: any = { projectId };

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.unitType) {
      where.unitType = query.unitType;
    }

    if (query?.towerId) {
      where.towerId = query.towerId;
    }

    const units = await this.prisma.unit.findMany({
      where,
      include: {
        tower: true,
      },
      orderBy: [
        { tower: { name: 'asc' } },
        { floor: 'asc' },
        { unitNumber: 'asc' },
      ],
    });

    return units;
  }

  async updateUnit(unitId: string, userId: string, updateData: any) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        project: {
          select: { builderId: true },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (unit.project.builderId !== userId) {
      throw new ForbiddenException('You can only update units in your own projects');
    }

    const updated = await this.prisma.unit.update({
      where: { id: unitId },
      data: updateData,
      include: {
        tower: true,
      },
    });

    return updated;
  }

  async getInventorySummary(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { builderId: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.builderId !== userId) {
      throw new ForbiddenException('You can only view inventory for your own projects');
    }

    const [
      totalUnits,
      availableUnits,
      soldUnits,
      bookedUnits,
      blockedUnits,
      holdUnits,
      unitsByType,
    ] = await Promise.all([
      this.prisma.unit.count({ where: { projectId } }),
      this.prisma.unit.count({ where: { projectId, status: 'AVAILABLE' } }),
      this.prisma.unit.count({ where: { projectId, status: 'SOLD' } }),
      this.prisma.unit.count({ where: { projectId, status: 'BOOKED' } }),
      this.prisma.unit.count({ where: { projectId, status: 'BLOCKED' } }),
      this.prisma.unit.count({ where: { projectId, status: 'HOLD' } }),
      this.prisma.unit.groupBy({
        by: ['unitType', 'status'],
        where: { projectId },
        _count: true,
      }),
    ]);

    return {
      totalUnits,
      availableUnits,
      soldUnits,
      bookedUnits,
      blockedUnits,
      holdUnits,
      unitsByType,
    };
  }

  async getProjectStats(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { builderId: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.builderId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const [totalLeads, totalUnits, soldUnits, revenue] = await Promise.all([
      this.prisma.lead.count({ where: { projectId } }),
      this.prisma.unit.count({ where: { projectId } }),
      this.prisma.unit.count({ where: { projectId, status: 'SOLD' } }),
      this.prisma.unit.aggregate({
        where: { projectId, status: 'SOLD' },
        _sum: { basePrice: true },
      }),
    ]);

    return {
      totalLeads,
      totalUnits,
      soldUnits,
      availableUnits: totalUnits - soldUnits,
      totalRevenue: revenue._sum.basePrice || 0,
    };
  }
}
