import express from 'express';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});