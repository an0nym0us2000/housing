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
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const locations_service_1 = require("./locations.service");
let LocationsController = class LocationsController {
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    getCities(query) {
        if (query) {
            return this.locationsService.searchCities(query);
        }
        return this.locationsService.getCities();
    }
    getCity(id) {
        return this.locationsService.getCity(id);
    }
    getLocalities(cityId, query) {
        if (query) {
            return this.locationsService.searchLocalities(cityId, query);
        }
        return this.locationsService.getLocalities(cityId);
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)('cities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active cities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of cities' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'Search query' }),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)('cities/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get city with localities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns city details with localities' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'City ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getCity", null);
__decorate([
    (0, common_1.Get)('cities/:cityId/localities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get localities for a city' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of localities' }),
    (0, swagger_1.ApiParam)({ name: 'cityId', description: 'City ID' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'Search query' }),
    __param(0, (0, common_1.Param)('cityId')),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getLocalities", null);
exports.LocationsController = LocationsController = __decorate([
    (0, swagger_1.ApiTags)('locations'),
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map