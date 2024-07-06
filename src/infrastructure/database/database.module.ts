import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../../domain/entities/user.entity';
import { Movie, MovieSchema } from '../../domain/entities/movie.entity';
import { Ticket, TicketSchema } from '../../domain/entities/ticket.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Movie.name, schema: MovieSchema },
            { name: Ticket.name, schema: TicketSchema },
        ]),
    ],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class DatabaseModule {}
