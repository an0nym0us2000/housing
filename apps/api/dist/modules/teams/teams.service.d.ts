import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-member.dto';
export declare class TeamsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createTeamDto: CreateTeamDto): Promise<any>;
    findAll(userId: string): Promise<any>;
    findOne(id: string, userId: string): Promise<any>;
    update(id: string, userId: string, updateTeamDto: UpdateTeamDto): Promise<any>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
    addMember(teamId: string, userId: string, addMemberDto: AddTeamMemberDto): Promise<any>;
    removeMember(teamId: string, memberId: string, userId: string): Promise<{
        message: string;
    }>;
    updateMemberRole(teamId: string, memberId: string, userId: string, role: string): Promise<any>;
    getTeamStats(teamId: string, userId: string): Promise<{
        totalListings: any;
        activeListings: any;
        totalLeads: any;
        pendingTasks: any;
    }>;
}
//# sourceMappingURL=teams.service.d.ts.map