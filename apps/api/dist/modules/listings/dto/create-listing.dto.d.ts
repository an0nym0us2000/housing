import { ListingType, PropertyType, FurnishingStatus, AvailabilityStatus } from '@housing/database';
export declare class CreateListingDto {
    title: string;
    description: string;
    listingType: ListingType;
    propertyType: PropertyType;
    cityId: string;
    localityId: string;
    address: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    bhk?: number;
    bathrooms?: number;
    balconies?: number;
    carpetArea?: number;
    builtUpArea?: number;
    plotArea?: number;
    furnishing?: FurnishingStatus;
    totalFloors?: number;
    floorNumber?: number;
    price: number;
    pricePerSqft?: number;
    securityDeposit?: number;
    maintenanceFee?: number;
    availability?: AvailabilityStatus;
    possessionDate?: string;
    propertyAge?: number;
    parking?: boolean;
    parkingCount?: number;
    amenityIds?: string[];
}
//# sourceMappingURL=create-listing.dto.d.ts.map