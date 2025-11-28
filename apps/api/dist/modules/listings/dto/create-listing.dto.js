"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateListingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const database_1 = require("@housing/database");
class CreateListingDto {
}
exports.CreateListingDto = CreateListingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Luxurious 3 BHK Apartment in Koramangala' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Spacious apartment with modern amenities...' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: database_1.ListingType, example: database_1.ListingType.SALE }),
    (0, class_validator_1.IsEnum)(database_1.ListingType),
    __metadata("design:type", typeof (_a = typeof database_1.ListingType !== "undefined" && database_1.ListingType) === "function" ? _a : Object)
], CreateListingDto.prototype, "listingType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: database_1.PropertyType, example: database_1.PropertyType.APARTMENT }),
    (0, class_validator_1.IsEnum)(database_1.PropertyType),
    __metadata("design:type", typeof (_b = typeof database_1.PropertyType !== "undefined" && database_1.PropertyType) === "function" ? _b : Object)
], CreateListingDto.prototype, "propertyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxx' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'clxxx' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "localityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street, Koramangala' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '560095' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "pincode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12.9352 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 77.6245 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "bhk", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "bathrooms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "balconies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1200 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "carpetArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1450 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "builtUpArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "plotArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: database_1.FurnishingStatus }),
    (0, class_validator_1.IsEnum)(database_1.FurnishingStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof database_1.FurnishingStatus !== "undefined" && database_1.FurnishingStatus) === "function" ? _c : Object)
], CreateListingDto.prototype, "furnishing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "totalFloors", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "floorNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3333 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "pricePerSqft", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "securityDeposit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "maintenanceFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: database_1.AvailabilityStatus }),
    (0, class_validator_1.IsEnum)(database_1.AvailabilityStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_d = typeof database_1.AvailabilityStatus !== "undefined" && database_1.AvailabilityStatus) === "function" ? _d : Object)
], CreateListingDto.prototype, "availability", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-01-01' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateListingDto.prototype, "possessionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "propertyAge", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateListingDto.prototype, "parking", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateListingDto.prototype, "parkingCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['clxxx', 'clyyy'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateListingDto.prototype, "amenityIds", void 0);
//# sourceMappingURL=create-listing.dto.js.map