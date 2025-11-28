import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly notificationsService;
    constructor(usersService: UsersService, jwtService: JwtService, notificationsService: NotificationsService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: User;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: any;
    }>;
    validateUser(userId: string): Promise<any>;
}
//# sourceMappingURL=auth.service.d.ts.map