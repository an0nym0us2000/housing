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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmenitiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const amenities_service_1 = require("./amenities.service");
let AmenitiesController = class AmenitiesController {
    constructor(amenitiesService) {
        this.amenitiesService = amenitiesService;
    }
    findAll(category) {
        if (category) {
            return this.amenitiesService.findByCategory(category);
        }
        return this.amenitiesService.findAll();
    }
};
exports.AmenitiesController = AmenitiesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active amenities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of amenities' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, example: 'lifestyle' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AmenitiesController.prototype, "findAll", null);
exports.AmenitiesController = AmenitiesController = __decorate([
    (0, swagger_1.ApiTags)('amenities'),
    (0, common_1.Controller)('amenities'),
    __metadata("design:paramtypes", [amenities_service_1.AmenitiesService])
], AmenitiesController);
//# sourceMappingURL=amenities.controller.js.map