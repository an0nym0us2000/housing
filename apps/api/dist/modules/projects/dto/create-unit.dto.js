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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUnitDto = exports.UnitStatus = exports.UnitType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var UnitType;
(function (UnitType) {
    UnitType["STUDIO"] = "STUDIO";
    UnitType["ONE_BHK"] = "ONE_BHK";
    UnitType["TWO_BHK"] = "TWO_BHK";
    UnitType["THREE_BHK"] = "THREE_BHK";
    UnitType["FOUR_BHK"] = "FOUR_BHK";
    UnitType["PENTHOUSE"] = "PENTHOUSE";
    UnitType["VILLA"] = "VILLA";
    UnitType["PLOT"] = "PLOT";
    UnitType["SHOP"] = "SHOP";
    UnitType["OFFICE"] = "OFFICE";
})(UnitType || (exports.UnitType = UnitType = {}));
var UnitStatus;
(function (UnitStatus) {
    UnitStatus["AVAILABLE"] = "AVAILABLE";
    UnitStatus["BLOCKED"] = "BLOCKED";
    UnitStatus["SOLD"] = "SOLD";
    UnitStatus["BOOKED"] = "BOOKED";
    UnitStatus["HOLD"] = "HOLD";
})(UnitStatus || (exports.UnitStatus = UnitStatus = {}));
class CreateUnitDto {
}
exports.CreateUnitDto = CreateUnitDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tower ID (optional for standalone units)',
        example: 'clx1234567890',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "towerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unit number',
        example: 'A-101',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "unitNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Floor number',
        example: 10,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unit type',
        enum: UnitType,
        example: 'TWO_BHK',
    }),
    (0, class_validator_1.IsEnum)(UnitType),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "unitType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Carpet area in sqft',
        example: 850,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "carpetArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Built-up area in sqft',
        example: 1100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "builtupArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Super area in sqft',
        example: 1250,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "superArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base price',
        example: 7500000,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Final price after discounts',
        example: 7200000,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "finalPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of bedrooms',
        example: 2,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "bedrooms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of bathrooms',
        example: 2,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "bathrooms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of balconies',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUnitDto.prototype, "balconies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Facing direction',
        example: 'North',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "facing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Furnishing status',
        example: 'Semi-furnished',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "furnishing", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit features',
        example: ['Modular Kitchen', 'False Ceiling', 'Vitrified Tiles'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUnitDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Unit status',
        enum: UnitStatus,
        example: 'AVAILABLE',
    }),
    (0, class_validator_1.IsEnum)(UnitStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "status", void 0);
//# sourceMappingURL=create-unit.dto.js.map