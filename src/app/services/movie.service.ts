import { Injectable, BadRequestException } from '@nestjs/common';
import { MovieRepository } from '../../domain/repositories/movie.repository';
import { Movie } from '../../domain/entities/movie.entity';
import { FilterSortMovieDto} from "../dtos/movie/filter-movie.dto";
import { CreateMovieDto } from "../dtos/movie/create-movie.dto";
import {UpdateMovieDto} from "../dtos/movie/update-movie.dto";

@Injectable()
export class MovieService {
    constructor(private readonly movieRepository: MovieRepository) {}

    async createMovie(movie: CreateMovieDto): Promise<Movie> {
        if (await this.movieRepository.isNameConflict(movie.name)) {
            throw new BadRequestException(`Movie with the name "${movie.name}" already exists.`);
        }

        for (const session of movie.sessions) {
            if (await this.movieRepository.isSessionConflict(session.date, session.timeSlot, session.roomNumber)) {
                throw new BadRequestException(`Room ${session.roomNumber} is already booked for ${session.date} at ${session.timeSlot}`);
            }
        }
        return await this.movieRepository.createMovie(movie);
    }

    async createMovies(movies: [CreateMovieDto]): Promise<Movie[]> {
        for (const movie of movies) {
            if (await this.movieRepository.isNameConflict(movie.name)) {
                throw new BadRequestException(`Movie with the name "${movie.name}" already exists.`);
            }

            for (const session of movie.sessions) {
                if (await this.movieRepository.isSessionConflict(session.date, session.timeSlot, session.roomNumber)) {
                    throw new BadRequestException(`Room ${session.roomNumber} is already booked for ${session.date} at ${session.timeSlot}`);
                }
            }
        }
        return await this.movieRepository.createMovies(movies);
    }

    async findAll(filters: FilterSortMovieDto): Promise<Movie[]> {
        return await this.movieRepository.findAll(filters);
    }

    async findOne(id: string): Promise<Movie> {
        return await this.movieRepository.findOne(id);
    }

    async updateMovie(id: string, movie: UpdateMovieDto): Promise<Movie> {
        for (const session of movie.sessions) {
            if (await this.movieRepository.isSessionConflict(session.date, session.timeSlot, session.roomNumber, id)) {
                throw new BadRequestException(`Room ${session.roomNumber} is already booked for ${session.date} at ${session.timeSlot}`);
            }
        }
        return await this.movieRepository.updateMovie(id, movie);
    }

    async deleteMovie(id: string): Promise<Movie> {
        return await this.movieRepository.deleteMovie(id);
    }

    async deleteMovies(ids: string[]): Promise<{ deletedCount?: number }> {
        return await this.movieRepository.deleteMovies(ids);
    }
}
