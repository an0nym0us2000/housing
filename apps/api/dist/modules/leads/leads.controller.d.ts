import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(createLeadDto: CreateLeadDto, req: any): Promise<any>;
    getOwnerLeads(req: any): Promise<any>;
    getStats(req: any): Promise<{
        total: any;
        new: any;
        contacted: any;
        qualified: any;
    }>;
    getLeadsByListing(listingId: string, req: any): Promise<any>;
    updateStatus(id: string, req: any, updateDto: UpdateLeadStatusDto): Promise<any>;
    markAsRead(id: string, req: any): Promise<any>;
}
//# sourceMappingURL=leads.controller.d.ts.map