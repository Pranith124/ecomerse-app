import mongoose from 'mongoose';
import {ENV} from '../config/env.js';

export const connectDB = async() =>{
    try{
        const connet= await mongoose.connect(ENV.DB_URL);
        console.log('MongoDB connected:', connet.connection.host);
    }
    catch(err){
        console.error('✅✅ Error connecting to MongoDB:', err);
        process.exit(1);
    }
}