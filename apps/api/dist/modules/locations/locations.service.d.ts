import { PrismaService } from '../prisma/prisma.service';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCities(): Promise<any>;
    getCity(id: string): Promise<any>;
    getLocalities(cityId: string): Promise<any>;
    searchCities(query: string): Promise<any>;
    searchLocalities(cityId: string, query: string): Promise<any>;
}
//# sourceMappingURL=locations.service.d.ts.map