import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: User;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: any;
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map