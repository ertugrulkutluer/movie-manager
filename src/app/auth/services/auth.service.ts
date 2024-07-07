import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { UserDocument } from '../../../domain/entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {UserRepository} from "../../../domain/repositories/user.repository";

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto): Promise<any> {
        const { username, password, age, role } = registerDto;

        const existingUser = await this.userRepository.findOne(username);
        if (existingUser) {
            throw new BadRequestException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await this.userRepository.createUser(
            { username, password: hashedPassword, age, role });
    }

    async login(loginDto: LoginDto): Promise<{access_token: string}> {
        const { username, password } = loginDto;
        const user: UserDocument = await this.userRepository.findOne(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const payload = { username: user.username, sub: user._id, role: user.role };
            return {access_token: this.jwtService.sign(payload)};
        }
        throw new UnauthorizedException('Invalid credentials');
    }
}
