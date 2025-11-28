import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTowerDto } from './dto/create-tower.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { BulkCreateUnitsDto } from './dto/bulk-create-units.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: any, createProjectDto: CreateProjectDto): Promise<any>;
    findAll(query: any): Promise<any>;
    getMyProjects(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    update(id: string, req: any, updateProjectDto: UpdateProjectDto): Promise<any>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
    createTower(id: string, req: any, createTowerDto: CreateTowerDto): Promise<any>;
    getTowers(id: string): Promise<any>;
    createUnit(id: string, req: any, createUnitDto: CreateUnitDto): Promise<any>;
    bulkCreateUnits(id: string, req: any, bulkCreateUnitsDto: BulkCreateUnitsDto): Promise<{
        message: string;
        units: any;
    }>;
    getUnits(id: string, query: any): Promise<any>;
    updateUnit(unitId: string, req: any, updateData: any): Promise<any>;
    getInventorySummary(id: string, req: any): Promise<{
        totalUnits: any;
        availableUnits: any;
        soldUnits: any;
        bookedUnits: any;
        blockedUnits: any;
        holdUnits: any;
        unitsByType: any;
    }>;
    getProjectStats(id: string, req: any): Promise<{
        totalLeads: any;
        totalUnits: any;
        soldUnits: any;
        availableUnits: number;
        totalRevenue: any;
    }>;
}
//# sourceMappingURL=projects.controller.d.ts.map