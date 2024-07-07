import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'ertugrul123', description: 'The username of the user' })
    username: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    password: string;

    @ApiProperty({ example: 25, description: 'The age of the user' })
    age: number;

    @ApiProperty({ example: 'customer', description: 'The role of the user', enum: ['manager', 'customer'] })
    role: 'manager' | 'customer';
}
