import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateTicketDto } from '../dtos/ticket/create-ticket.dto';

@ApiTags('tickets')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new ticket' })
    @ApiResponse({ status: 201, description: 'The ticket has been successfully created.' })
    async create(@Body() ticket: CreateTicketDto) {
        return this.ticketService.createTicket(ticket);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tickets' })
    @ApiResponse({ status: 200, description: 'Return all tickets.' })
    async findAll() {
        return this.ticketService.findAll();
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get tickets by user ID' })
    @ApiResponse({ status: 200, description: 'Return all tickets for a specific user.' })
    async findByUserId(@Param('userId') userId: string) {
        return this.ticketService.findByUserId(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a ticket by ID' })
    @ApiResponse({ status: 200, description: 'Return the ticket.' })
    @ApiResponse({ status: 404, description: 'Ticket not found.' })
    async findOne(@Param('id') id: string) {
        return this.ticketService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a ticket by ID' })
    @ApiResponse({ status: 200, description: 'The ticket has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Ticket not found.' })
    async remove(@Param('id') id: string) {
        return this.ticketService.deleteTicket(id);
    }
}
