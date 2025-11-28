import { PrismaService } from '../prisma/prisma.service';
export declare class AmenitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findByCategory(category: string): Promise<any>;
}
//# sourceMappingURL=amenities.service.d.ts.map