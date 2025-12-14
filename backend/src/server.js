import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import mongoose from 'mongoose'; // Import the default export/entire package object
const { Connection } = mongoose;

const app = express();

const __dirname = path.resolve();

app.use(clerkMiddleware());

app.get('/api/health', (req,res) =>{
    res.status(200).json({message:"Success"});
})

if(ENV.NODE_ENV === 'production'){{
    app.use(express.static(path.join(__dirname,'../admin/dist')));

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,'../admin','dist','index.html'));
    })
}}

app.get('')


const startServer= async() =>{
    await connectDB();
    app.listen(ENV.PORT,()=>{
        console.log(`Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
    })
};

startServer();