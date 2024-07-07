import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketService } from './services/ticket.service';
import { TicketController } from './controllers/ticket.controller';
import { Ticket, TicketSchema } from '../../domain/entities/ticket.entity';
import { TicketRepository } from '../../domain/repositories/ticket.repository';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }])
    ],
    controllers: [TicketController],
    providers: [TicketService, TicketRepository],
    exports: [TicketService]
})
export class TicketsModule {}
