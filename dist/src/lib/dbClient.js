// src/db/dbClient.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'my_database';
class MongoDBClient {
    static async connect() {
        if (!this.client) {
            this.client = new MongoClient(uri);
            await this.client.connect();
            this.db = this.client.db(dbName);
            console.log(`✅ Connected to MongoDB: ${dbName}`);
        }
    }
    static getCollection(name) {
        if (!this.db) {
            throw new Error('MongoDB not connected. Call connect() first.');
        }
        return this.db.collection(name);
    }
    static async find(collection, filter = {}) {
        return this.getCollection(collection).find(filter).toArray();
    }
    static async insert(collection, doc) {
        return this.getCollection(collection).insertOne(doc);
    }
    static async update(collection, filter, update) {
        return this.getCollection(collection).updateOne(filter, update);
    }
    static async delete(collection, filter) {
        return this.getCollection(collection).deleteOne(filter);
    }
    static async disconnect() {
        if (this.client) {
            await this.client.close();
            console.log('🛑 MongoDB disconnected');
        }
    }
}
export default MongoDBClient;
