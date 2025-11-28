export declare enum UserRole {
    BUYER = "buyer",
    OWNER = "owner",
    BROKER = "broker",
    BUILDER = "builder",
    ADMIN = "admin"
}
export declare class RegisterDto {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
    phone?: string;
}
//# sourceMappingURL=register.dto.d.ts.map