export declare enum ProjectType {
    APARTMENT = "APARTMENT",
    VILLA = "VILLA",
    PLOT = "PLOT",
    COMMERCIAL = "COMMERCIAL",
    MIXED_USE = "MIXED_USE"
}
export declare enum ProjectStatus {
    UPCOMING = "UPCOMING",
    UNDER_CONSTRUCTION = "UNDER_CONSTRUCTION",
    READY_TO_MOVE = "READY_TO_MOVE",
    COMPLETED = "COMPLETED"
}
export declare class CreateProjectDto {
    name: string;
    description: string;
    cityId: string;
    localityId?: string;
    address: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
    projectType: ProjectType;
    projectStatus: ProjectStatus;
    reraNumber?: string;
    totalArea?: number;
    totalTowers?: number;
    totalUnits?: number;
    launchDate?: string;
    possessionDate?: string;
    priceMin?: number;
    priceMax?: number;
    amenities?: string[];
    features?: string[];
    images?: string[];
    brochureUrl?: string;
    videoUrl?: string;
}
//# sourceMappingURL=create-project.dto.d.ts.map