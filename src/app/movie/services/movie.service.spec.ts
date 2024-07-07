import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieRepository } from '../../../domain/repositories/movie.repository';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import * as mongoose from 'mongoose';

describe('MovieService', () => {
    let service: MovieService;
    let repository: MovieRepository;
    let createdMovieId: string;

    const mockMovieRepository = {
        createMovie: jest.fn().mockImplementation((movie: CreateMovieDto) => {
            const id = new mongoose.Types.ObjectId().toHexString();
            return Promise.resolve({ _id: id, ...movie });
        }),
        findAll: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({ _id: id })),
        updateMovie: jest.fn().mockImplementation((id: string, movie: UpdateMovieDto) => Promise.resolve({ _id: id, ...movie })),
        deleteMovie: jest.fn().mockImplementation((id: string) => Promise.resolve({ _id: id })),
        isNameConflict: jest.fn().mockResolvedValue(false),
        isSessionConflict: jest.fn().mockResolvedValue(false),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MovieService,
                { provide: MovieRepository, useValue: mockMovieRepository },
            ],
        }).compile();

        service = module.get<MovieService>(MovieService);
        repository = module.get<MovieRepository>(MovieRepository);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a movie', async () => {
        const movie: CreateMovieDto = {
            name: 'Test Movie',
            ageRestriction: 'PG-13',
            sessions: [
                { date: '2024-07-28', timeSlot: '10:00-12:00', roomNumber: 1 },
                { date: '2024-07-29', timeSlot: '12:00-14:00', roomNumber: 2 }
            ],
            price: 15
        };
        const createdMovie = await service.createMovie(movie);
        createdMovieId = createdMovie['_id'];
        expect(createdMovie).toHaveProperty('_id');
        expect(createdMovie.name).toEqual(movie.name);
        expect(createdMovie.ageRestriction).toEqual(movie.ageRestriction);
        expect(createdMovie.sessions).toEqual(expect.arrayContaining(movie.sessions));
        expect(repository.createMovie).toHaveBeenCalledWith(movie);
    });

    it('should find all movies', async () => {
        const movies = await service.findAll({});
        expect(movies).toEqual([]);
        expect(repository.findAll).toHaveBeenCalled();
    });

    it('should find one movie by id', async () => {
        const foundMovie = await service.findOne(createdMovieId);
        expect(foundMovie).toHaveProperty('_id', createdMovieId);
        expect(repository.findOne).toHaveBeenCalledWith(createdMovieId);
    });

    it('should update a movie', async () => {
        const movie: UpdateMovieDto = {
            name: 'Updated Movie',
            ageRestriction: 'R',
            sessions: [
                { date: '2024-07-30', timeSlot: '14:00-16:00', roomNumber: 3 }
            ],
            price: 20
        };
        const updatedMovie = await service.updateMovie(createdMovieId, movie);
        expect(updatedMovie).toHaveProperty('_id', createdMovieId);
        expect(updatedMovie.name).toEqual(movie.name);
        expect(updatedMovie.ageRestriction).toEqual(movie.ageRestriction);
        expect(updatedMovie.sessions).toEqual(expect.arrayContaining(movie.sessions));
        expect(repository.updateMovie).toHaveBeenCalledWith(createdMovieId, movie);
    });

    it('should delete a movie', async () => {
        const deletedMovie = await service.deleteMovie(createdMovieId);
        expect(deletedMovie).toHaveProperty('_id', createdMovieId);
        expect(repository.deleteMovie).toHaveBeenCalledWith(createdMovieId);
    });
});
