import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from '../../src/domain/entities/movie.entity';
import { Ticket } from '../../src/domain/entities/ticket.entity';
import { User } from '../../src/domain/entities/user.entity';
import * as mongoose from 'mongoose';

jest.setTimeout(20000);

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let movieModel: Model<Movie>;
    let ticketModel: Model<Ticket>;
    let userModel: Model<User>;
    let authToken: string;
    let userId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        movieModel = moduleFixture.get<Model<Movie>>(getModelToken(Movie.name));
        ticketModel = moduleFixture.get<Model<Ticket>>(getModelToken(Ticket.name));
        userModel = moduleFixture.get<Model<User>>(getModelToken(User.name));
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await movieModel.deleteMany({});
        await ticketModel.deleteMany({});
        await userModel.deleteMany({});

        const user = { username: 'john_doe', password: 'password123', age: 30, role: 'manager' };

        const registerResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send(user)
            .expect(201);

        userId = registerResponse.body._id;

        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: user.username, password: user.password })
            .expect(201);

        authToken = loginResponse.body.access_token;
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect(/Movie Management API/);
    });

    it('/movies (POST)', async () => {
        const movie = { name: 'Test Movie', ageRestriction: 'PG-13', sessions: [], price: 15 };
        const response = await request(app.getHttpServer())
            .post('/movies')
            .set('Authorization', `Bearer ${authToken}`)
            .send(movie)
            .expect(201);

        expect(response.body).toMatchObject(movie);
    });

    it('/movies (GET)', async () => {
        await movieModel.create({ name: 'Test Movie', ageRestriction: 'PG-13', sessions: [], price: 15 });
        const response = await request(app.getHttpServer())
            .get('/movies')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0]).toMatchObject({ name: 'Test Movie' });
    });

    it('/movies/:id (GET)', async () => {
        const movie = await movieModel.create({ name: 'Test Movie', ageRestriction: 'PG-13', sessions: [], price: 15 });
        const response = await request(app.getHttpServer())
            .get(`/movies/${movie._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body).toMatchObject({ _id: movie._id.toString(), name: 'Test Movie' });
    });

    it('/movies/:id (PUT)', async () => {
        const movie = await movieModel.create({ name: 'Test Movie', ageRestriction: 'PG-13', sessions: [], price: 15 });
        const updatedMovie = { name: 'Updated Movie', ageRestriction: 'R', sessions: [], price: 20 };
        const response = await request(app.getHttpServer())
            .put(`/movies/${movie._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedMovie)
            .expect(200);

        expect(response.body).toMatchObject(updatedMovie);
    });

    it('/movies/:id (DELETE)', async () => {
        const movie = await movieModel.create({ name: 'Test Movie', ageRestriction: 'PG-13', sessions: [], price: 15 });
        await request(app.getHttpServer())
            .delete(`/movies/${movie._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        const response = await request(app.getHttpServer())
            .get('/movies')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.length).toBe(0);
    });

    it('/tickets (POST)', async () => {
        const movie = await movieModel.create({ name: 'Test Movie', ageRestriction: 'PG-13', sessions: [{ date: new Date(), timeSlot: '10:00-12:00', roomNumber: 1 }], price: 15 });
        const ticket = { sessionId: movie.sessions[0]['_id'].toString(), userId: userId, movieId: movie._id.toString(), purchaseDate: new Date(), price: 15 };

        const response = await request(app.getHttpServer())
            .post('/tickets')
            .set('Authorization', `Bearer ${authToken}`)
            .send(ticket)
            .expect(201);

        expect(response.body).toMatchObject({
            ...ticket,
            purchaseDate: ticket.purchaseDate.toISOString()
        });
    });

    it('/tickets/user (GET)', async () => {
        const movie = await movieModel.create({ name: 'Test Movie', ageRestriction: 'PG-13', sessions: [{ date: new Date(), timeSlot: '10:00-12:00', roomNumber: 1 }], price: 15 });
        const ticket = await ticketModel.create({ sessionId: movie.sessions[0]['_id'].toString(), userId: userId, movieId: movie._id.toString(), purchaseDate: new Date(), price: 15 });

        const response = await request(app.getHttpServer())
            .get('/tickets/user')
            .query({ userId: userId })
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0]._id).toBe(ticket._id.toString());
    });

    it('/tickets/:id (DELETE)', async () => {
        const movie = await movieModel.create({ name: 'Test Movie', ageRestriction: 'PG-13', sessions: [{ date: new Date(), timeSlot: '10:00-12:00', roomNumber: 1 }], price: 15 });
        const ticket = await ticketModel.create({ sessionId: movie.sessions[0]['_id'].toString(), userId: userId, movieId: movie._id.toString(), purchaseDate: new Date(), price: 15 });

        await request(app.getHttpServer())
            .delete(`/tickets/${ticket._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        const response = await request(app.getHttpServer())
            .get('/tickets/user')
            .query({ userId: userId })
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.length).toBe(0);
    });

    it('/auth/login (POST)', async () => {
        const login = { username: 'john_doe', password: 'password123' };

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(login)
            .expect(201);

        expect(response.body).toHaveProperty('access_token');
    });
});
