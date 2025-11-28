import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingDto } from './dto/query-listing.dto';
export declare class ListingsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(userId: string, data: CreateListingDto): Promise<any>;
    findAll(query: QueryListingDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, userId: string, data: UpdateListingDto): Promise<any>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    submitForReview(id: string, userId: string): Promise<any>;
    getUserListings(userId: string, query: QueryListingDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    approveListing(id: string, moderatorId: string): Promise<any>;
    rejectListing(id: string, moderatorId: string, reason: string): Promise<any>;
}
//# sourceMappingURL=listings.service.d.ts.map