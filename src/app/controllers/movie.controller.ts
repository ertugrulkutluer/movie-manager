import {Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards} from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth} from '@nestjs/swagger';
import { CreateMovieDto } from '../dtos/movie/create-movie.dto';
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import {FilterSortMovieDto} from "../dtos/movie/filter-movie.dto";
import {UpdateMovieDto} from "../dtos/movie/update-movie.dto";
import {RolesGuard} from "../guards/roles.guard";
import {Roles} from "../decorators/roles.decorator";

@ApiTags('movies')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService) {}

    @Post()
    @Roles('manager')
    @ApiOperation({ summary: 'Create a new movie' })
    @ApiResponse({ status: 201, description: 'The movie has been successfully created.' })
    async create(@Body() movie: CreateMovieDto) {
        return await this.movieService.createMovie(movie);
    }

    @Post('bulk')
    @Roles('manager')
    @ApiOperation({ summary: 'Create multiple movies' })
    @ApiResponse({ status: 201, description: 'The movies have been successfully created.' })
    async createBulk(@Body() moviesBulkDto: [CreateMovieDto]) {
        return await this.movieService.createMovies(moviesBulkDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all movies' })
    @ApiResponse({ status: 200, description: 'Return all movies.' })
    async findAll(@Query() filter: FilterSortMovieDto) {
        return await this.movieService.findAll(filter);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a movie by ID' })
    @ApiResponse({ status: 200, description: 'Return the movie.' })
    @ApiResponse({ status: 404, description: 'Movie not found.' })
    async findOne(@Param('id') id: string) {
        return await this.movieService.findOne(id);
    }

    @Put(':id')
    @Roles('manager')
    @ApiOperation({ summary: 'Update a movie by ID' })
    @ApiResponse({ status: 200, description: 'The movie has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Movie not found.' })
    async update(@Param('id') id: string, @Body() movie: UpdateMovieDto) {
        return await this.movieService.updateMovie(id, movie);
    }

    @Delete('bulk')
    @Roles('manager')
    @ApiOperation({ summary: 'Delete multiple movies by IDs' })
    @ApiResponse({ status: 200, description: 'The movies have been successfully deleted.' })
    async removeBulk(@Body() ids: [string]) {
        return await this.movieService.deleteMovies(ids);
    }

    @Delete(':id')
    @Roles('manager')
    @ApiOperation({ summary: 'Delete a movie by ID' })
    @ApiResponse({ status: 200, description: 'The movie has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Movie not found.' })
    async remove(@Param('id') id: string) {
        return await this.movieService.deleteMovie(id);
    }
}
