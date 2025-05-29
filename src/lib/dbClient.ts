// src/db/dbClient.ts
import { MongoClient, Db, Collection, Document, WithId, Filter, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'my_database';

class MongoDBClient {
    private static client: MongoClient;
    private static db: Db;

    public static async connect(): Promise<void> {
        if (!this.client) {
            this.client = new MongoClient(uri);
            await this.client.connect();
            this.db = this.client.db(dbName);
            console.log(`✅ Connected to MongoDB: ${dbName}`);
        }
    }

    public static getCollection<T extends Document>(name: string): Collection<T> {
        if (!this.db) {
            throw new Error('MongoDB not connected. Call connect() first.');
        }
        return this.db.collection<T>(name);
    }

    public static async find<T extends Document>(collection: string, filter: Filter<T> = {}): Promise<WithId<T>[]> {
        return this.getCollection<T>(collection).find(filter).toArray();
    }

    public static async insert<T extends Document>(collection: string, doc: OptionalUnlessRequiredId<T>) {
        return this.getCollection<T>(collection).insertOne(doc);
    }

    public static async update<T extends Document>(collection: string, filter: Filter<T>, update: UpdateFilter<T>) {
        return this.getCollection<T>(collection).updateOne(filter, update);
    }

    public static async delete<T extends Document>(collection: string, filter: Filter<T>) {
        return this.getCollection<T>(collection).deleteOne(filter);
    }

    public static async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            console.log('🛑 MongoDB disconnected');
        }
    }
}

export default MongoDBClient;
