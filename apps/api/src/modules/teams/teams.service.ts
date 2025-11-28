import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-member.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTeamDto: CreateTeamDto) {
    // Verify user is a broker
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'BROKER') {
      throw new ForbiddenException('Only brokers can create teams');
    }

    // Create team with owner as first member
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

  async findAll(userId: string) {
    // Get all teams where user is a member
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

  async findOne(id: string, userId: string) {
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
      throw new NotFoundException('Team not found or access denied');
    }

    return team;
  }

  async update(id: string, userId: string, updateTeamDto: UpdateTeamDto) {
    // Check if user is team owner or admin
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
      throw new ForbiddenException('Only team owners and admins can update team details');
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

  async delete(id: string, userId: string) {
    // Only team owner can delete team
    const team = await this.prisma.team.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owner can delete the team');
    }

    await this.prisma.team.delete({
      where: { id },
    });

    return { message: 'Team deleted successfully' };
  }

  async addMember(teamId: string, userId: string, addMemberDto: AddTeamMemberDto) {
    // Check if user is team owner or admin
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
      throw new ForbiddenException('Only team owners and admins can add members');
    }

    // Check if user to add exists
    const userToAdd = await this.prisma.user.findUnique({
      where: { id: addMemberDto.userId },
    });

    if (!userToAdd) {
      throw new NotFoundException('User not found');
    }

    // Check if already a member
    const existingMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: addMemberDto.userId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a team member');
    }

    // Add member
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

  async removeMember(teamId: string, memberId: string, userId: string) {
    // Check if user is team owner or admin
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
      throw new ForbiddenException('Only team owners and admins can remove members');
    }

    // Check if trying to remove owner
    const memberToRemove = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: memberId,
      },
      select: { role: true },
    });

    if (!memberToRemove) {
      throw new NotFoundException('Team member not found');
    }

    if (memberToRemove.role === 'OWNER') {
      throw new ForbiddenException('Cannot remove team owner');
    }

    // Remove member
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

  async updateMemberRole(teamId: string, memberId: string, userId: string, role: string) {
    // Only team owner can update roles
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: { ownerId: true },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owner can update member roles');
    }

    // Cannot change owner role
    const memberToUpdate = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: memberId,
      },
      select: { role: true },
    });

    if (!memberToUpdate) {
      throw new NotFoundException('Team member not found');
    }

    if (memberToUpdate.role === 'OWNER') {
      throw new ForbiddenException('Cannot change owner role');
    }

    // Update role
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

  async getTeamStats(teamId: string, userId: string) {
    // Check if user is team member
    const membership = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Access denied');
    }

    const [totalListings, activeListings, totalLeads, pendingTasks] = await Promise.all([
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
}
