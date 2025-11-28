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
exports.VisitsController = void 0;
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const visits_service_1 = require("./visits.service");
const create_visit_dto_1 = require("./dto/create-visit.dto");
const update_visit_dto_1 = require("./dto/update-visit.dto");
const query_visit_dto_1 = require("./dto/query-visit.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let VisitsController = class VisitsController {
    constructor(visitsService) {
        this.visitsService = visitsService;
    }
    create(req, createVisitDto) {
        return this.visitsService.create(req.user.id, createVisitDto);
    }
    findAll(query) {
        return this.visitsService.findAll(query);
    }
    getMyVisitsAsVisitor(req, query) {
        return this.visitsService.getMyVisitsAsVisitor(req.user.id, query);
    }
    getMyVisitsAsOwner(req, query) {
        return this.visitsService.getMyVisitsAsOwner(req.user.id, query);
    }
    getVisitStats(req) {
        return this.visitsService.getVisitStats(req.user.id);
    }
    findOne(id) {
        return this.visitsService.findOne(id);
    }
    confirmVisit(id, req, updateVisitDto) {
        return this.visitsService.confirmVisit(id, req.user.id, updateVisitDto);
    }
    rescheduleVisit(id, req, updateVisitDto) {
        return this.visitsService.rescheduleVisit(id, req.user.id, updateVisitDto);
    }
    cancelVisit(id, req, updateVisitDto) {
        return this.visitsService.cancelVisit(id, req.user.id, updateVisitDto);
    }
    completeVisit(id, req, updateVisitDto) {
        return this.visitsService.completeVisit(id, req.user.id, updateVisitDto);
    }
};
exports.VisitsController = VisitsController;
__decorate([
    (0, swagger_1.Post)(),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Schedule a property visit' }),
    (0, swagger_2.ApiResponse)({ status: 201, description: 'Visit scheduled successfully' }),
    (0, swagger_2.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_2.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, swagger_1.Request)()),
    __param(1, (0, swagger_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_visit_dto_1.CreateVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "create", null);
__decorate([
    (0, swagger_1.Get)(),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Get all visits (admin only)' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Returns paginated visits' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, swagger_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_visit_dto_1.QueryVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.Get)('my-visits-as-visitor'),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Get my scheduled visits' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Returns user\'s scheduled visits' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, swagger_1.Request)()),
    __param(1, (0, swagger_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_visit_dto_1.QueryVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "getMyVisitsAsVisitor", null);
__decorate([
    (0, swagger_1.Get)('my-visits-as-owner'),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Get visit requests for my properties' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Returns visit requests for owner\'s properties' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, swagger_1.Request)()),
    __param(1, (0, swagger_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_visit_dto_1.QueryVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "getMyVisitsAsOwner", null);
__decorate([
    (0, swagger_1.Get)('stats'),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Get visit statistics' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Returns visit statistics' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, swagger_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "getVisitStats", null);
__decorate([
    (0, swagger_1.Get)(':id'),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Get a visit by ID' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Returns visit details' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_2.ApiResponse)({ status: 404, description: 'Visit not found' }),
    __param(0, (0, swagger_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.Post)(':id/confirm'),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Confirm a visit request (owner only)' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Visit confirmed' }),
    (0, swagger_2.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_2.ApiResponse)({ status: 404, description: 'Visit not found' }),
    __param(0, (0, swagger_1.Param)('id')),
    __param(1, (0, swagger_1.Request)()),
    __param(2, (0, swagger_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_visit_dto_1.UpdateVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "confirmVisit", null);
__decorate([
    (0, swagger_1.Post)(':id/reschedule'),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Reschedule a visit' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Visit rescheduled' }),
    (0, swagger_2.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_2.ApiResponse)({ status: 404, description: 'Visit not found' }),
    __param(0, (0, swagger_1.Param)('id')),
    __param(1, (0, swagger_1.Request)()),
    __param(2, (0, swagger_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_visit_dto_1.UpdateVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "rescheduleVisit", null);
__decorate([
    (0, swagger_1.Post)(':id/cancel'),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Cancel a visit' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Visit cancelled' }),
    (0, swagger_2.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_2.ApiResponse)({ status: 404, description: 'Visit not found' }),
    __param(0, (0, swagger_1.Param)('id')),
    __param(1, (0, swagger_1.Request)()),
    __param(2, (0, swagger_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_visit_dto_1.UpdateVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "cancelVisit", null);
__decorate([
    (0, swagger_1.Post)(':id/complete'),
    (0, swagger_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_2.ApiBearerAuth)(),
    (0, swagger_2.ApiOperation)({ summary: 'Mark visit as completed (visitor only)' }),
    (0, swagger_2.ApiResponse)({ status: 200, description: 'Visit marked as completed' }),
    (0, swagger_2.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_2.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_2.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_2.ApiResponse)({ status: 404, description: 'Visit not found' }),
    __param(0, (0, swagger_1.Param)('id')),
    __param(1, (0, swagger_1.Request)()),
    __param(2, (0, swagger_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_visit_dto_1.UpdateVisitDto]),
    __metadata("design:returntype", void 0)
], VisitsController.prototype, "completeVisit", null);
exports.VisitsController = VisitsController = __decorate([
    (0, swagger_2.ApiTags)('visits'),
    (0, swagger_1.Controller)('visits'),
    __metadata("design:paramtypes", [visits_service_1.VisitsService])
], VisitsController);
//# sourceMappingURL=visits.controller.js.map