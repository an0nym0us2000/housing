import { PrismaService } from '../prisma/prisma.service';
export declare class SavedListingsService {
    private prisma;
    constructor(prisma: PrismaService);
    save(userId: string, listingId: string): Promise<any>;
    unsave(userId: string, listingId: string): Promise<{
        message: string;
    }>;
    getUserSavedListings(userId: string): Promise<any>;
    isSaved(userId: string, listingId: string): Promise<{
        isSaved: boolean;
    }>;
}
//# sourceMappingURL=saved-listings.service.d.ts.map