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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createProjectDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (!user || user.role !== 'BUILDER') {
            throw new common_1.ForbiddenException('Only builders can create projects');
        }
        const slug = createProjectDto.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
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
    async findAll(query) {
        const where = {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Project not found');
        }
        return project;
    }
    async findBySlug(slug) {
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
            throw new common_1.NotFoundException('Project not found');
        }
        return project;
    }
    async getMyProjects(userId) {
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
    async update(id, userId, updateProjectDto) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            select: { builderId: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.builderId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own projects');
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
    async delete(id, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            select: { builderId: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.builderId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own projects');
        }
        await this.prisma.project.delete({
            where: { id },
        });
        return { message: 'Project deleted successfully' };
    }
    async createTower(projectId, userId, createTowerDto) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { builderId: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.builderId !== userId) {
            throw new common_1.ForbiddenException('You can only add towers to your own projects');
        }
        const tower = await this.prisma.tower.create({
            data: {
                ...createTowerDto,
                projectId,
            },
        });
        return tower;
    }
    async getTowers(projectId) {
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
    async createUnit(projectId, userId, createUnitDto) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { builderId: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.builderId !== userId) {
            throw new common_1.ForbiddenException('You can only add units to your own projects');
        }
        const existing = await this.prisma.unit.findUnique({
            where: {
                projectId_unitNumber: {
                    projectId,
                    unitNumber: createUnitDto.unitNumber,
                },
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Unit number already exists in this project');
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
    async bulkCreateUnits(projectId, userId, bulkCreateUnitsDto) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { builderId: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.builderId !== userId) {
            throw new common_1.ForbiddenException('You can only add units to your own projects');
        }
        const createdUnits = await this.prisma.$transaction(bulkCreateUnitsDto.units.map((unit) => this.prisma.unit.create({
            data: {
                ...unit,
                projectId,
            },
        })));
        return {
            message: `Successfully created ${createdUnits.length} units`,
            units: createdUnits,
        };
    }
    async getUnits(projectId, query) {
        const where = { projectId };
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
    async updateUnit(unitId, userId, updateData) {
        const unit = await this.prisma.unit.findUnique({
            where: { id: unitId },
            include: {
                project: {
                    select: { builderId: true },
                },
            },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        if (unit.project.builderId !== userId) {
            throw new common_1.ForbiddenException('You can only update units in your own projects');
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
    async getInventorySummary(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { builderId: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.builderId !== userId) {
            throw new common_1.ForbiddenException('You can only view inventory for your own projects');
        }
        const [totalUnits, availableUnits, soldUnits, bookedUnits, blockedUnits, holdUnits, unitsByType,] = await Promise.all([
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
    async getProjectStats(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { builderId: true },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.builderId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map