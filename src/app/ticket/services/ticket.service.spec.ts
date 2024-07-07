import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from '../../../domain/repositories/ticket.repository';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import * as mongoose from 'mongoose';

describe('TicketService', () => {
    let service: TicketService;
    let repository: TicketRepository;
    let createdTicketId: string;

    const mockTicketRepository = {
        createTicket: jest.fn().mockImplementation((ticket: CreateTicketDto) => {
            const id = new mongoose.Types.ObjectId().toHexString();
            return Promise.resolve({ _id: id, ...ticket });
        }),
        findAll: jest.fn().mockResolvedValue([]),
        findByUserId: jest.fn().mockImplementation((userId: string) => Promise.resolve([{ _id: new mongoose.Types.ObjectId().toHexString(), userId }])),
        findOne: jest.fn().mockImplementation((id: string) => Promise.resolve({ _id: id })),
        deleteTicket: jest.fn().mockImplementation((id: string) => Promise.resolve({ _id: id })),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketService,
                { provide: TicketRepository, useValue: mockTicketRepository },
            ],
        }).compile();

        service = module.get<TicketService>(TicketService);
        repository = module.get<TicketRepository>(TicketRepository);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a ticket', async () => {
        const ticket: CreateTicketDto = {
            movieId: new mongoose.Types.ObjectId().toHexString(),
            userId: new mongoose.Types.ObjectId().toHexString(),
            sessionId: new mongoose.Types.ObjectId().toHexString(),
            purchaseDate: new Date(),
            price: 15,
        };
        const createdTicket = await service.createTicket(ticket);
        createdTicketId = createdTicket['_id'];
        expect(createdTicket).toHaveProperty('_id');
        expect(createdTicket).toEqual(expect.objectContaining(ticket));
        expect(repository.createTicket).toHaveBeenCalledWith(ticket);
    });

    it('should find all tickets', async () => {
        const tickets = await service.findAll();
        expect(tickets).toEqual([]);
        expect(repository.findAll).toHaveBeenCalled();
    });

    it('should find tickets by userId', async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();
        const tickets = await service.findByUserId(userId);
        expect(tickets).toEqual([{ _id: expect.any(String), userId }]);
        expect(repository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('should find one ticket by id', async () => {
        const foundTicket = await service.findOne(createdTicketId);
        expect(foundTicket).toHaveProperty('_id', createdTicketId);
        expect(repository.findOne).toHaveBeenCalledWith(createdTicketId);
    });

    it('should delete a ticket', async () => {
        const deletedTicket = await service.deleteTicket(createdTicketId);
        expect(deletedTicket).toHaveProperty('_id', createdTicketId);
        expect(repository.deleteTicket).toHaveBeenCalledWith(createdTicketId);
    });
});
