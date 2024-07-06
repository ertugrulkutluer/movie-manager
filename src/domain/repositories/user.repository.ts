import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async createUser(user: User): Promise<UserDocument> {
        const createdUser = new this.userModel(user);
        return await createdUser.save();
    }

    async findOne(username: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ username }).exec();
    }

}
