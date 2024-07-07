import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully registered.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
