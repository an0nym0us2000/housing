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
exports.SavedListingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const saved_listings_service_1 = require("./saved-listings.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let SavedListingsController = class SavedListingsController {
    constructor(savedListingsService) {
        this.savedListingsService = savedListingsService;
    }
    save(req, listingId) {
        return this.savedListingsService.save(req.user.id, listingId);
    }
    unsave(req, listingId) {
        return this.savedListingsService.unsave(req.user.id, listingId);
    }
    getUserSavedListings(req) {
        return this.savedListingsService.getUserSavedListings(req.user.id);
    }
    isSaved(req, listingId) {
        return this.savedListingsService.isSaved(req.user.id, listingId);
    }
};
exports.SavedListingsController = SavedListingsController;
__decorate([
    (0, common_1.Post)(':listingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Save a listing (add to wishlist)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Listing saved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Listing already saved' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SavedListingsController.prototype, "save", null);
__decorate([
    (0, common_1.Delete)(':listingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a saved listing (remove from wishlist)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing removed from saved' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SavedListingsController.prototype, "unsave", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all saved listings for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns saved listings' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SavedListingsController.prototype, "getUserSavedListings", null);
__decorate([
    (0, common_1.Get)(':listingId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if a listing is saved' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns saved status' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing ID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SavedListingsController.prototype, "isSaved", null);
exports.SavedListingsController = SavedListingsController = __decorate([
    (0, swagger_1.ApiTags)('saved-listings'),
    (0, common_1.Controller)('saved-listings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [saved_listings_service_1.SavedListingsService])
], SavedListingsController);
//# sourceMappingURL=saved-listings.controller.js.map