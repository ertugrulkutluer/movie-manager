import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument } from '../entities/ticket.entity';
import { CreateTicketDto } from '../../app/dtos/ticket/create-ticket.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class TicketRepository {
    constructor(@InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>) {}

    async createTicket(ticket: CreateTicketDto): Promise<TicketDocument> {
        try {
            const createdTicket = new this.ticketModel(ticket);
            return await createdTicket.save();
        } catch (error) {
            throw new Error(`Failed to create ticket: ${error.message}`);
        }
    }

    async findAll(): Promise<any[]> {
        try {
            const pipeline = this.buildAggregationPipeline({});
            return await this.ticketModel.aggregate(pipeline).exec();
        } catch (error) {
            throw new Error(`Failed to find tickets: ${error.message}`);
        }
    }

    async findByUserId(userId: string): Promise<any[]> {
        try {
            const pipeline = this.buildAggregationPipeline({ userId });
            return await this.ticketModel.aggregate(pipeline).exec();
        } catch (error) {
            throw new Error(`Failed to find tickets for user with id ${userId}: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<any> {
        try {
            const pipeline = this.buildAggregationPipeline({ _id: new mongoose.Types.ObjectId(id) });
            const tickets = await this.ticketModel.aggregate(pipeline).exec();

            if (!tickets || tickets.length === 0) {
                throw new NotFoundException(`Ticket with id ${id} not found`);
            }

            return tickets[0];
        } catch (error) {
            throw new Error(`Failed to find ticket with id ${id}: ${error.message}`);
        }
    }

    async deleteTicket(id: string): Promise<TicketDocument> {
        try {
            const ticket = await this.ticketModel.findByIdAndDelete(id).exec();

            if (!ticket) {
                throw new NotFoundException(`Ticket with id ${id} not found`);
            }

            return ticket;
        } catch (error) {
            throw new Error(`Failed to delete ticket with id ${id}: ${error.message}`);
        }
    }

    private buildAggregationPipeline(matchStage: any): mongoose.PipelineStage[] {
        return [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'movies',
                    localField: 'movieId',
                    foreignField: '_id',
                    as: 'movie'
                }
            },
            { $unwind: '$movie' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    purchaseDate: 1,
                    price: 1,
                    movie: {
                        _id: '$movie._id',
                        name: '$movie.name',
                        ageRestriction: '$movie.ageRestriction',
                    },
                    user: 1,
                    selected_session: {
                        $filter: {
                            input: '$movie.sessions',
                            as: 'session',
                            cond: { $eq: ['$$session._id', '$sessionId'] }
                        }
                    }
                }
            },
            { $unwind: '$selected_session' }
        ];
    }
}
