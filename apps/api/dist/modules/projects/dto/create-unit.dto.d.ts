export declare enum UnitType {
    STUDIO = "STUDIO",
    ONE_BHK = "ONE_BHK",
    TWO_BHK = "TWO_BHK",
    THREE_BHK = "THREE_BHK",
    FOUR_BHK = "FOUR_BHK",
    PENTHOUSE = "PENTHOUSE",
    VILLA = "VILLA",
    PLOT = "PLOT",
    SHOP = "SHOP",
    OFFICE = "OFFICE"
}
export declare enum UnitStatus {
    AVAILABLE = "AVAILABLE",
    BLOCKED = "BLOCKED",
    SOLD = "SOLD",
    BOOKED = "BOOKED",
    HOLD = "HOLD"
}
export declare class CreateUnitDto {
    towerId?: string;
    unitNumber: string;
    floor?: number;
    unitType: UnitType;
    carpetArea?: number;
    builtupArea?: number;
    superArea?: number;
    basePrice: number;
    finalPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
    facing?: string;
    furnishing?: string;
    features?: string[];
    status?: UnitStatus;
}
//# sourceMappingURL=create-unit.dto.d.ts.map