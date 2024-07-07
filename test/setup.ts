import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import * as mongoose from 'mongoose';

beforeAll(async () => {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
});
