import {Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query} from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import {ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import {RequestWithUser} from "../../auth/interfaces/request-with-user.interface";

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

    @Get('user')
    @ApiOperation({
        summary: 'Get tickets by user ID',
        description: 'Retrieve all tickets for a specific user. ' +
            'If a userId query parameter is provided, it will be used to find the user. ' +
            'If not, the user ID will be extracted from the token.'
    })
    @ApiQuery({ name: 'userId', required: false, description: 'User ID (optional, defaults to user in token)' })
    @ApiResponse({ status: 200, description: 'Return all tickets for a specific user.' })
    async findByUserId(@Req() req: RequestWithUser, @Query('userId') userId?: string) {
        const id = userId || req.user.userId;
        return this.ticketService.findByUserId(id);
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
