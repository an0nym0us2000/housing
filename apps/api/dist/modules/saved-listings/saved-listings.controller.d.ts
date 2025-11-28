import { SavedListingsService } from './saved-listings.service';
export declare class SavedListingsController {
    private readonly savedListingsService;
    constructor(savedListingsService: SavedListingsService);
    save(req: any, listingId: string): Promise<any>;
    unsave(req: any, listingId: string): Promise<{
        message: string;
    }>;
    getUserSavedListings(req: any): Promise<any>;
    isSaved(req: any, listingId: string): Promise<{
        isSaved: boolean;
    }>;
}
//# sourceMappingURL=saved-listings.controller.d.ts.map