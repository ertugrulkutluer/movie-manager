import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
    @ApiProperty({ example: 'Inception', description: 'The name of the movie' })
    name: string;

    @ApiProperty({ example: 'PG-13', description: 'The age restriction for the movie' })
    ageRestriction: string;

    @ApiProperty({
        type: [Object],
        description: 'The sessions for the movie',
        example: [
            {
                date: '2024-12-01',
                timeSlot: '10:00-12:00',
                roomNumber: 1,
            },
        ],
    })
    sessions: { date: string; timeSlot: string; roomNumber: number }[];

    @ApiProperty({ example: 15.00, description: 'The price of the movie' })
    price: number;
}
