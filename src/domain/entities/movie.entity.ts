import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Session {
    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    timeSlot: string;

    @Prop({ required: true })
    roomNumber: number;
}

const SessionSchema = SchemaFactory.createForClass(Session);
@Schema()
export class Movie {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    ageRestriction: string;

    @Prop({ type: [{ date: String, timeSlot: String, roomNumber: Number }] })
    sessions:  Session[];

    @Prop ({ required: true })
    price: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
