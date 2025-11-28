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
exports.AddTeamMemberDto = exports.TeamRole = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var TeamRole;
(function (TeamRole) {
    TeamRole["OWNER"] = "OWNER";
    TeamRole["ADMIN"] = "ADMIN";
    TeamRole["AGENT"] = "AGENT";
})(TeamRole || (exports.TeamRole = TeamRole = {}));
class AddTeamMemberDto {
}
exports.AddTeamMemberDto = AddTeamMemberDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to add as team member',
        example: 'clx1234567890',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddTeamMemberDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role for the team member',
        enum: TeamRole,
        example: 'AGENT',
    }),
    (0, class_validator_1.IsEnum)(TeamRole),
    __metadata("design:type", String)
], AddTeamMemberDto.prototype, "role", void 0);
//# sourceMappingURL=add-member.dto.js.map