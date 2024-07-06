import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './app/modules/auth.module';
import { DatabaseModule } from "./infrastructure/database/database.module";
import { AppController } from "./app.controller";
import {MoviesModule} from "./app/modules/movie.module";
import {TicketsModule} from "./app/modules/ticket.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    MoviesModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
