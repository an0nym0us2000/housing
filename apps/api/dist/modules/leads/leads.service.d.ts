import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
export declare class LeadsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(createLeadDto: CreateLeadDto, userId?: string): Promise<any>;
    getOwnerLeads(ownerId: string): Promise<any>;
    getLeadsByListing(listingId: string, userId: string): Promise<any>;
    updateStatus(leadId: string, ownerId: string, updateDto: UpdateLeadStatusDto): Promise<any>;
    markAsRead(leadId: string, ownerId: string): Promise<any>;
    getLeadStats(userId: string): Promise<{
        total: any;
        new: any;
        contacted: any;
        qualified: any;
    }>;
}
//# sourceMappingURL=leads.service.d.ts.map