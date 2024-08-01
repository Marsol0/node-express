import express from 'express';
import userRouter from './src/route/user.js'
import ticketRouter from './src/route/tickets.js'
import "dotenv/config"
import mongoose from 'mongoose';

const app = express()


mongoose.connect(process.env.MONGO_CONNECT)
.then(() => {
    console.log("Successfully connected to mongodb")
});

app.use(express.json());

app.use(userRouter)
app.use(ticketRouter)


app.use((req, res)=>{
    res.status(404).json({ message: "The requested endpoint does not exist." })
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port: ${process.env.PORT}`)
});