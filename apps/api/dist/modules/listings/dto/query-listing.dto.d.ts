import { ListingType, PropertyType, ListingStatus } from '@housing/database';
export declare class QueryListingDto {
    page?: number;
    limit?: number;
    listingType?: ListingType;
    propertyType?: PropertyType;
    status?: ListingStatus;
    cityId?: string;
    localityId?: string;
    minPrice?: number;
    maxPrice?: number;
    bhk?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
//# sourceMappingURL=query-listing.dto.d.ts.map