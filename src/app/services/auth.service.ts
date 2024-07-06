import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from '../../domain/entities/user.entity';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {UserRepository} from "../../domain/repositories/user.repository";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto): Promise<any> {
        const { username, password, age, role } = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser: UserDocument = await this.userRepository.createUser(
            { username, password: hashedPassword, age, role });
        return createdUser;
    }

    async login(loginDto: LoginDto): Promise<string> {
        const { username, password } = loginDto;
        const user: UserDocument = await this.userRepository.findOne(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const payload = { username: user.username, sub: user._id, role: user.role };
            return this.jwtService.sign(payload);
        }
        throw new UnauthorizedException('Invalid credentials');
    }
}
