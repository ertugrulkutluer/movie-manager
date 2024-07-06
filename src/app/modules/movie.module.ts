import { Module } from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { MovieController } from '../controllers/movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from '../../domain/entities/movie.entity';
import { MovieRepository } from '../../domain/repositories/movie.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }])
    ],
    controllers: [MovieController],
    providers: [MovieService, MovieRepository],
    exports: [MovieService]
})
export class MoviesModule {}
