import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../entities/movie.entity';
import { FilterSortMovieDto } from "../../app/movie/dtos/filter-movie.dto";
import { CreateMovieDto } from "../../app/movie/dtos/create-movie.dto";
import { UpdateMovieDto } from "../../app/movie/dtos/update-movie.dto";
import mongoose from "mongoose";

@Injectable()
export class MovieRepository {
    constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

    async createMovie(movie: CreateMovieDto): Promise<MovieDocument> {
        try {
            const createdMovie = new this.movieModel(movie);
            return await createdMovie.save();
        } catch (error) {
            throw new Error(`Failed to create movie: ${error.message}`);
        }
    }

    async createMovies(movies: [CreateMovieDto]): Promise<MovieDocument[]> {
        try {
            const createdMovies = await this.movieModel.insertMany(movies);
            return createdMovies.map(movie => new this.movieModel(movie).toObject() as MovieDocument);
        } catch (error) {
            throw new Error(`Failed to create movies: ${error.message}`);
        }
    }

    async findAll(filters: FilterSortMovieDto): Promise<MovieDocument[]> {
        try {
            const filterObject = this.buildFilterObject(filters);
            const sortObject = this.buildSortObject(filters);

            return await this.movieModel.find(filterObject).sort(sortObject).exec();
        } catch (error) {
            throw new Error(`Failed to find movies with filters: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<MovieDocument> {
        try {
            const movie = await this.movieModel.findById(id).exec();
            if (!movie) {
                throw new NotFoundException(`Movie with id ${id} not found`);
            }
            return movie;
        } catch (error) {
            throw new NotFoundException(`Failed to find movie with id ${id}: ${error.message}`);
        }
    }

    async updateMovie(id: string, movie: UpdateMovieDto): Promise<MovieDocument> {
        try {
            return await this.movieModel.findByIdAndUpdate(id, movie, { new: true }).exec();
        } catch (error) {
            throw new Error(`Failed to update movie with id ${id}: ${error.message}`);
        }
    }

    async deleteMovie(id: string): Promise<MovieDocument> {
        try {
            return await this.movieModel.findByIdAndDelete(id).exec();
        } catch (error) {
            throw new Error(`Failed to delete movie with id ${id}: ${error.message}`);
        }
    }

    async deleteMovies(ids: string[]): Promise<{ deletedCount?: number }> {
        try {
            return await this.movieModel.deleteMany({ _id: { $in: ids } }).exec();
        } catch (error) {
            throw new Error(`Failed to delete movies with ids ${ids.join(', ')}: ${error.message}`);
        }
    }

    async isNameConflict(name: string): Promise<boolean> {
        try {
            const nameConflict = await this.movieModel.findOne({ name }).exec();
            return !!nameConflict;
        } catch (error) {
            throw new Error(`Failed to check for movie name conflict: ${error.message}`);
        }
    }

    async isSessionConflict(date: string, timeSlot: string, roomNumber: number, excludeMovieId?: string): Promise<boolean> {
        try {
            const query: any = { 'sessions.date': date, 'sessions.timeSlot': timeSlot, 'sessions.roomNumber': roomNumber };
            if (excludeMovieId) {
                query._id = { $ne: excludeMovieId };
            }
            const roomConflict = await this.movieModel.findOne(query).exec();
            return !!roomConflict;
        } catch (error) {
            throw new Error(`Failed to check for session conflict: ${error.message}`);
        }
    }

    async findByIds(ids: mongoose.Types.ObjectId[]): Promise<MovieDocument[]> {
        return this.movieModel.find({ _id: { $in: ids.map(id => id) } }).exec();
    }

    private buildFilterObject(filters: FilterSortMovieDto): any {
        const filterObject = {};

        if (filters.name) filterObject['name'] = { $regex: filters.name, $options: 'i' };
        if (filters.ageRestriction) filterObject['ageRestriction'] = filters.ageRestriction;
        if (filters.sessionDate) filterObject['sessionDate'] = filters.sessionDate;
        if (filters.sessionTimeSlot) filterObject['sessionTimeSlot'] = filters.sessionTimeSlot;
        if (filters.sessionRoomNumber) filterObject['sessionRoomNumber'] = filters.sessionRoomNumber;

        return filterObject;
    }

    private buildSortObject(filters: FilterSortMovieDto): any {
        const sortObject = {};

        if (filters.sort_key) {
            sortObject[filters.sort_key] = filters.sort_direction === 'asc' ? 1 : -1;
        }

        return sortObject;
    }
}
