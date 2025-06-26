import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';
import authRouter from './routes/auth.routes.js';
import stampRouter from './routes/stamp.routes.js';
import postRouter from './routes/post.routes.js';

const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();
app.use(express.json({
    limit: '500mb'
}));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

//Routes
app.use("/api/auth", authRouter);
app.use("/api/stamps", stampRouter);
app.use("/api/posts", postRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});