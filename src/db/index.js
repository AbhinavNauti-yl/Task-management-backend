import mongoose from 'mongoose';
import { databaseName } from '../constants.js';

const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODBCONNECTIONSTRING}${databaseName}`)
        console.log("db connected")
    } catch (error) {
        throw new Error(`Error connecting to the database: ${error.message}`);
        process.exit(1);
    }
}
export default dbConnect;