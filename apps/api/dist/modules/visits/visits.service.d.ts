import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { QueryVisitDto } from './dto/query-visit.dto';
export declare class VisitsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, data: CreateVisitDto): Promise<any>;
    findAll(query: QueryVisitDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    getMyVisitsAsVisitor(userId: string, query: QueryVisitDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyVisitsAsOwner(userId: string, query: QueryVisitDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    confirmVisit(id: string, userId: string, data: UpdateVisitDto): Promise<any>;
    rescheduleVisit(id: string, userId: string, data: UpdateVisitDto): Promise<any>;
    cancelVisit(id: string, userId: string, data: UpdateVisitDto): Promise<any>;
    completeVisit(id: string, userId: string, data: UpdateVisitDto): Promise<any>;
    getVisitStats(userId: string): Promise<{
        asVisitor: any;
        asOwner: any;
        requestedAsOwner: any;
        confirmedAsOwner: any;
        upcomingAsVisitor: any;
    }>;
}
//# sourceMappingURL=visits.service.d.ts.map