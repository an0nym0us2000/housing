import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTowerDto } from './dto/create-tower.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { BulkCreateUnitsDto } from './dto/bulk-create-units.dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createProjectDto: CreateProjectDto): Promise<any>;
    findAll(query?: any): Promise<any>;
    findOne(id: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    getMyProjects(userId: string): Promise<any>;
    update(id: string, userId: string, updateProjectDto: UpdateProjectDto): Promise<any>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
    createTower(projectId: string, userId: string, createTowerDto: CreateTowerDto): Promise<any>;
    getTowers(projectId: string): Promise<any>;
    createUnit(projectId: string, userId: string, createUnitDto: CreateUnitDto): Promise<any>;
    bulkCreateUnits(projectId: string, userId: string, bulkCreateUnitsDto: BulkCreateUnitsDto): Promise<{
        message: string;
        units: any;
    }>;
    getUnits(projectId: string, query?: any): Promise<any>;
    updateUnit(unitId: string, userId: string, updateData: any): Promise<any>;
    getInventorySummary(projectId: string, userId: string): Promise<{
        totalUnits: any;
        availableUnits: any;
        soldUnits: any;
        bookedUnits: any;
        blockedUnits: any;
        holdUnits: any;
        unitsByType: any;
    }>;
    getProjectStats(projectId: string, userId: string): Promise<{
        totalLeads: any;
        totalUnits: any;
        soldUnits: any;
        availableUnits: number;
        totalRevenue: any;
    }>;
}
//# sourceMappingURL=projects.service.d.ts.map