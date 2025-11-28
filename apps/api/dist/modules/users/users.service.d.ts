import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@housing/database';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        name: string;
        password: string;
        role?: UserRole;
        phone?: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<User>;
}
//# sourceMappingURL=users.service.d.ts.map