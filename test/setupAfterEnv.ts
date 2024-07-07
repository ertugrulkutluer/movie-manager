import * as mongoose from 'mongoose';

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});
