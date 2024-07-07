import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsDate, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export enum MovieSortKeyType {
    name = 'name',
    ageRestriction = 'ageRestriction',
    sessionDate = 'sessionDate',
    sessionTimeSlot = 'sessionTimeSlot',
    sessionRoomNumber = 'sessionRoomNumber',
}

export class FilterSortMovieDto {
    @IsOptional()
    @IsEnum(MovieSortKeyType)
    @ApiProperty({
        enum: MovieSortKeyType,
        description: 'Sort key for the movies',
    })
    sort_key?: MovieSortKeyType;

    @IsOptional()
    @ApiProperty({ description: 'Sort direction', enum: ['asc', 'desc'], required: false })
    sort_direction?: 'asc' | 'desc';

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Filter by movie name', required: false })
    name?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Filter by age restriction', required: false })
    ageRestriction?: string;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @ApiProperty({ description: 'Filter by session date', required: false })
    sessionDate?: Date;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Filter by session time slot', required: false })
    sessionTimeSlot?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @ApiProperty({ description: 'Filter by session room number', required: false })
    sessionRoomNumber?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @ApiProperty({ description: 'Filter by price', required: false })
    price?: number;
}
