import 'dotenv/config';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import mongoose from 'mongoose';

const user = getEnvVariable("MONGODB_USER");
const pass = getEnvVariable("MONGODB_PASSWORD");
const db = getEnvVariable("MONGODB_DB");
const cluster = getEnvVariable("MONGODB_URL");

const DB_URI = `mongodb+srv://${user}:${pass}@${cluster}/${db}?retryWrites=true&w=majority&appName=Cluster01`;

export async function initMongoConnection () {
await mongoose.connect(DB_URI);
}
