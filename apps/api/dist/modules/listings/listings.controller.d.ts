import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingDto } from './dto/query-listing.dto';
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    create(req: any, createListingDto: CreateListingDto): Promise<any>;
    findAll(query: QueryListingDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserListings(req: any, query: QueryListingDto): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, req: any, updateListingDto: UpdateListingDto): Promise<any>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    submitForReview(id: string, req: any): Promise<any>;
    approveListing(id: string, req: any): Promise<any>;
    rejectListing(id: string, req: any, reason: string): Promise<any>;
}
//# sourceMappingURL=listings.controller.d.ts.map