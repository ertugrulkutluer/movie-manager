import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie', required: true })
    movieId: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie.Session', required: true })
    sessionId: Types.ObjectId;

    @Prop({ required: true })
    purchaseDate: Date;

    @Prop({ required: true })
    price: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.pre('save', function (next) {
    if (typeof this.movieId === 'string') {
        this.movieId = new Types.ObjectId(this.movieId);
    }
    if (typeof this.userId === 'string') {
        this.userId = new Types.ObjectId(this.userId);
    }
    if (typeof this.sessionId === 'string') {
        this.sessionId = new Types.ObjectId(this.sessionId);
    }
    next();
});
