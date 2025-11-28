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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVisitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const database_1 = require("@housing/database");
class UpdateVisitDto {
}
exports.UpdateVisitDto = UpdateVisitDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Visit status', required: false, enum: database_1.VisitStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(database_1.VisitStatus),
    __metadata("design:type", typeof (_a = typeof database_1.VisitStatus !== "undefined" && database_1.VisitStatus) === "function" ? _a : Object)
], UpdateVisitDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reschedule date and time', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rescheduling reason', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "rescheduledReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Owner notes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "ownerNotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cancellation reason', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "cancellationReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Feedback after visit', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVisitDto.prototype, "feedback", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rating (1-5)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateVisitDto.prototype, "rating", void 0);
//# sourceMappingURL=update-visit.dto.js.map