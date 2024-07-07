import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
    @ApiProperty({ example: '66898764abae4ecae5d4532b', description: 'The ID of the movie' })
    movieId: string;

    @ApiProperty({ example: '668970ce8a44c1ba2ba0cfa2', description: 'The ID of the user' })
    userId: string;

    @ApiProperty({ example: '66898ce4b2eae7292ec4089b', description: 'The ID of the session' })
    sessionId: string;

    @ApiProperty({ example: '2024-07-06T00:00:00.000Z', description: 'The date the ticket was purchased' })
    purchaseDate: Date;

    @ApiProperty({ example: 15.00, description: 'The price of the ticket' })
    price: number;
}
