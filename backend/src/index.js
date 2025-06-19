import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

//Routes
app.use("/api/auth", authRouter)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});