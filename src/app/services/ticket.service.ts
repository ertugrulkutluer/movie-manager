import { Injectable } from '@nestjs/common';
import { TicketRepository } from '../../domain/repositories/ticket.repository';
import { Ticket } from '../../domain/entities/ticket.entity';
import {CreateTicketDto} from "../dtos/ticket/create-ticket.dto";

@Injectable()
export class TicketService {
    constructor(private readonly ticketRepository: TicketRepository) {}

    async createTicket(ticket: CreateTicketDto): Promise<Ticket> {
        return await this.ticketRepository.createTicket(ticket);
    }

    async findAll(): Promise<Ticket[]> {
        return await this.ticketRepository.findAll();
    }

    async findByUserId(userId: string): Promise<Ticket[]> {
        return await this.ticketRepository.findByUserId(userId);
    }

    async findOne(id: string): Promise<Ticket> {
        return await this.ticketRepository.findOne(id);
    }

    async deleteTicket(id: string): Promise<Ticket> {
        return await this.ticketRepository.deleteTicket(id);
    }
}
