import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-member.dto';
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    create(req: any, createTeamDto: CreateTeamDto): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(id: string, req: any): Promise<any>;
    update(id: string, req: any, updateTeamDto: UpdateTeamDto): Promise<any>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
    addMember(id: string, req: any, addMemberDto: AddTeamMemberDto): Promise<any>;
    removeMember(id: string, memberId: string, req: any): Promise<{
        message: string;
    }>;
    updateMemberRole(id: string, memberId: string, req: any, body: {
        role: string;
    }): Promise<any>;
    getTeamStats(id: string, req: any): Promise<{
        totalListings: any;
        activeListings: any;
        totalLeads: any;
        pendingTasks: any;
    }>;
}
//# sourceMappingURL=teams.controller.d.ts.map