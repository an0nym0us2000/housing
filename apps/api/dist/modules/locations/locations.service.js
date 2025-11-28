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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LocationsService = class LocationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCities() {
        return this.prisma.city.findMany({
            where: { isActive: true },
            orderBy: [{ priority: 'desc' }, { name: 'asc' }],
            select: {
                id: true,
                name: true,
                state: true,
                country: true,
                latitude: true,
                longitude: true,
            },
        });
    }
    async getCity(id) {
        return this.prisma.city.findUnique({
            where: { id },
            include: {
                localities: {
                    where: { isActive: true },
                    orderBy: { name: 'asc' },
                },
            },
        });
    }
    async getLocalities(cityId) {
        return this.prisma.locality.findMany({
            where: { cityId, isActive: true },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                cityId: true,
                pincode: true,
                latitude: true,
                longitude: true,
            },
        });
    }
    async searchCities(query) {
        return this.prisma.city.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { state: { contains: query, mode: 'insensitive' } },
                ],
            },
            orderBy: [{ priority: 'desc' }, { name: 'asc' }],
            take: 10,
        });
    }
    async searchLocalities(cityId, query) {
        return this.prisma.locality.findMany({
            where: {
                cityId,
                isActive: true,
                name: { contains: query, mode: 'insensitive' },
            },
            orderBy: { name: 'asc' },
            take: 20,
        });
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map