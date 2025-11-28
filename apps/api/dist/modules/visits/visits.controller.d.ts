import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { QueryVisitDto } from './dto/query-visit.dto';
export declare class VisitsController {
    private readonly visitsService;
    constructor(visitsService: VisitsService);
    create(req: any, createVisitDto: CreateVisitDto): Promise<any>;
    findAll(query: QueryVisitDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyVisitsAsVisitor(req: any, query: QueryVisitDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyVisitsAsOwner(req: any, query: QueryVisitDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getVisitStats(req: any): Promise<{
        asVisitor: any;
        asOwner: any;
        requestedAsOwner: any;
        confirmedAsOwner: any;
        upcomingAsVisitor: any;
    }>;
    findOne(id: string): Promise<any>;
    confirmVisit(id: string, req: any, updateVisitDto: UpdateVisitDto): Promise<any>;
    rescheduleVisit(id: string, req: any, updateVisitDto: UpdateVisitDto): Promise<any>;
    cancelVisit(id: string, req: any, updateVisitDto: UpdateVisitDto): Promise<any>;
    completeVisit(id: string, req: any, updateVisitDto: UpdateVisitDto): Promise<any>;
}
//# sourceMappingURL=visits.controller.d.ts.map