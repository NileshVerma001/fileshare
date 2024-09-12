import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// Type the global object to avoid the implicit 'any' error
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn; // Return cached connection if already available
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI || '', opts).then((mongooseInstance) => {
            return mongooseInstance.connection; // Return the connection object
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
