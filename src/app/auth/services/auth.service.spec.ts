import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import * as bcrypt from 'bcrypt';
import mongoose from "mongoose";

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: UserRepository;
    let jwtService: JwtService;

    const mockUserRepository = {
        findOne: jest.fn().mockImplementation((username: string) => {
            if (username === 'john_doe') {
                return Promise.resolve({
                    _id: new mongoose.Types.ObjectId(),
                    username: 'john_doe',
                    password: bcrypt.hashSync('password123', 10),
                    age: 30,
                    role: 'customer',
                });
            }
            return null;
        }),
    };

    const mockJwtService = {
        sign: jest.fn().mockImplementation((payload) => 'test_token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserRepository, useValue: mockUserRepository },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get<UserRepository>(UserRepository);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should login a user with valid credentials', async () => {
        const loginDto: LoginDto = {
            username: 'john_doe',
            password: 'password123',
        };

        const token = await service.login(loginDto);
        expect(token).toStrictEqual({ access_token: 'test_token' });
        expect(userRepository.findOne).toHaveBeenCalledWith('john_doe');
        expect(jwtService.sign).toHaveBeenCalledWith({
            username: 'john_doe',
            sub: expect.any(mongoose.Types.ObjectId),
            role: 'customer',
        });
    });

    it('should throw an error if credentials are invalid', async () => {
        const loginDto: LoginDto = {
            username: 'john_doe',
            password: 'wrong_password',
        };

        await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
});
