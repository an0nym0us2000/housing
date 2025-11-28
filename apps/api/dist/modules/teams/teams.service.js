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
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeamsService = class TeamsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createTeamDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        if (!user || user.role !== 'BROKER') {
            throw new common_1.ForbiddenException('Only brokers can create teams');
        }
        const team = await this.prisma.team.create({
            data: {
                name: createTeamDto.name,
                description: createTeamDto.description,
                ownerId: userId,
                members: {
                    create: {
                        userId: userId,
                        role: 'OWNER',
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        companyName: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
        return team;
    }
    async findAll(userId) {
        const teams = await this.prisma.team.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        companyName: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        members: true,
                        listings: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return teams;
    }
    async findOne(id, userId) {
        const team = await this.prisma.team.findFirst({
            where: {
                id,
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        companyName: true,
                        phone: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                                phone: true,
                            },
                        },
                    },
                    orderBy: {
                        joinedAt: 'asc',
                    },
                },
                listings: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        price: true,
                        city: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    take: 10,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                _count: {
                    select: {
                        members: true,
                        listings: true,
                    },
                },
            },
        });
        if (!team) {
            throw new common_1.NotFoundException('Team not found or access denied');
        }
        return team;
    }
    async update(id, userId, updateTeamDto) {
        const membership = await this.prisma.teamMember.findFirst({
            where: {
                teamId: id,
                userId: userId,
                role: {
                    in: ['OWNER', 'ADMIN'],
                },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Only team owners and admins can update team details');
        }
        const team = await this.prisma.team.update({
            where: { id },
            data: updateTeamDto,
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
        return team;
    }
    async delete(id, userId) {
        const team = await this.prisma.team.findUnique({
            where: { id },
            select: { ownerId: true },
        });
        if (!team) {
            throw new common_1.NotFoundException('Team not found');
        }
        if (team.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only team owner can delete the team');
        }
        await this.prisma.team.delete({
            where: { id },
        });
        return { message: 'Team deleted successfully' };
    }
    async addMember(teamId, userId, addMemberDto) {
        const membership = await this.prisma.teamMember.findFirst({
            where: {
                teamId,
                userId,
                role: {
                    in: ['OWNER', 'ADMIN'],
                },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Only team owners and admins can add members');
        }
        const userToAdd = await this.prisma.user.findUnique({
            where: { id: addMemberDto.userId },
        });
        if (!userToAdd) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingMember = await this.prisma.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId,
                    userId: addMemberDto.userId,
                },
            },
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already a team member');
        }
        const teamMember = await this.prisma.teamMember.create({
            data: {
                teamId,
                userId: addMemberDto.userId,
                role: addMemberDto.role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return teamMember;
    }
    async removeMember(teamId, memberId, userId) {
        const membership = await this.prisma.teamMember.findFirst({
            where: {
                teamId,
                userId,
                role: {
                    in: ['OWNER', 'ADMIN'],
                },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Only team owners and admins can remove members');
        }
        const memberToRemove = await this.prisma.teamMember.findFirst({
            where: {
                teamId,
                userId: memberId,
            },
            select: { role: true },
        });
        if (!memberToRemove) {
            throw new common_1.NotFoundException('Team member not found');
        }
        if (memberToRemove.role === 'OWNER') {
            throw new common_1.ForbiddenException('Cannot remove team owner');
        }
        await this.prisma.teamMember.delete({
            where: {
                teamId_userId: {
                    teamId,
                    userId: memberId,
                },
            },
        });
        return { message: 'Member removed successfully' };
    }
    async updateMemberRole(teamId, memberId, userId, role) {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            select: { ownerId: true },
        });
        if (!team) {
            throw new common_1.NotFoundException('Team not found');
        }
        if (team.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only team owner can update member roles');
        }
        const memberToUpdate = await this.prisma.teamMember.findFirst({
            where: {
                teamId,
                userId: memberId,
            },
            select: { role: true },
        });
        if (!memberToUpdate) {
            throw new common_1.NotFoundException('Team member not found');
        }
        if (memberToUpdate.role === 'OWNER') {
            throw new common_1.ForbiddenException('Cannot change owner role');
        }
        const updated = await this.prisma.teamMember.update({
            where: {
                teamId_userId: {
                    teamId,
                    userId: memberId,
                },
            },
            data: { role },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return updated;
    }
    async getTeamStats(teamId, userId) {
        const membership = await this.prisma.teamMember.findFirst({
            where: {
                teamId,
                userId,
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const [totalListings, activeListings, totalLeads, pendingTasks,] = await Promise.all([
            this.prisma.listing.count({
                where: { teamId },
            }),
            this.prisma.listing.count({
                where: { teamId, status: 'PUBLISHED' },
            }),
            this.prisma.lead.count({
                where: {
                    listing: {
                        teamId,
                    },
                },
            }),
            this.prisma.task.count({
                where: {
                    assignedTo: {
                        teamMemberships: {
                            some: {
                                teamId,
                            },
                        },
                    },
                    status: {
                        in: ['TODO', 'IN_PROGRESS'],
                    },
                },
            }),
        ]);
        return {
            totalListings,
            activeListings,
            totalLeads,
            pendingTasks,
        };
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map