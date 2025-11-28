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
exports.CreateProjectDto = exports.ProjectStatus = exports.ProjectType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ProjectType;
(function (ProjectType) {
    ProjectType["APARTMENT"] = "APARTMENT";
    ProjectType["VILLA"] = "VILLA";
    ProjectType["PLOT"] = "PLOT";
    ProjectType["COMMERCIAL"] = "COMMERCIAL";
    ProjectType["MIXED_USE"] = "MIXED_USE";
})(ProjectType || (exports.ProjectType = ProjectType = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["UPCOMING"] = "UPCOMING";
    ProjectStatus["UNDER_CONSTRUCTION"] = "UNDER_CONSTRUCTION";
    ProjectStatus["READY_TO_MOVE"] = "READY_TO_MOVE";
    ProjectStatus["COMPLETED"] = "COMPLETED";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
class CreateProjectDto {
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project name',
        example: 'Prestige Lakeside Habitat',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project description',
        example: 'Luxury apartment complex with world-class amenities',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City ID',
        example: 'clx1234567890',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Locality ID',
        example: 'clx0987654321',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "localityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project address',
        example: 'Varthur Road, Whitefield, Bangalore',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pincode',
        example: '560066',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "pincode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Latitude',
        example: 12.9716,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Longitude',
        example: 77.5946,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project type',
        enum: ProjectType,
        example: 'APARTMENT',
    }),
    (0, class_validator_1.IsEnum)(ProjectType),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "projectType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project status',
        enum: ProjectStatus,
        example: 'UNDER_CONSTRUCTION',
    }),
    (0, class_validator_1.IsEnum)(ProjectStatus),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "projectStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'RERA registration number',
        example: 'PRM/KA/RERA/1251/446/PR/171120/002426',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "reraNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total area in acres/sqft',
        example: 25.5,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "totalArea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total towers/blocks',
        example: 12,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "totalTowers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Total units',
        example: 1200,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "totalUnits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Project launch date',
        example: '2023-01-15',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "launchDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expected possession date',
        example: '2026-12-31',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "possessionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum price',
        example: 5000000,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum price',
        example: 15000000,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProjectDto.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Project amenities',
        example: ['Swimming Pool', 'Gym', 'Clubhouse', 'Children Play Area'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "amenities", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Project features',
        example: ['24x7 Security', 'Power Backup', 'Lift', 'Parking'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Project images',
        example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProjectDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brochure URL',
        example: 'https://example.com/brochure.pdf',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "brochureUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Video URL',
        example: 'https://youtube.com/watch?v=xxxxx',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "videoUrl", void 0);
//# sourceMappingURL=create-project.dto.js.map