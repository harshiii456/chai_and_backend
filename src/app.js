import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db/index.js';
import dotenv from 'dotenv';

const app = express();

dotenv.config({
  path: './env'
});

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static('public'));
app.use(cookieParser());

await connectDB();

//routes

import userRouter from './routes/user.routes.js';

app.use((req, res, next) => {

  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();

})

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

//routes declaration
app.use('/api/v1/users', userRouter);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running, http://localhost:${process.env.PORT || 8000}`);
});

export default app;