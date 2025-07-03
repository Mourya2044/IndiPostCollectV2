import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';
import authRouter from './routes/auth.routes.js';
import stampRouter from './routes/stamp.routes.js';
import postRouter from './routes/post.routes.js';
import cartRouter from './routes/cart.routes.js';

const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();
app.use(express.json({
    limit: '500mb'
}));
app.use(cookieParser());

app.use(cors({
    origin: process.env.NODE_ENV === "development"
        ? ["http://localhost:5173", "http://192.168.0.100:5173"]
        : "https://indi-post-collect-v2.vercel.app",
    credentials: true,
}));

//Routes
app.use("/api/auth", authRouter);
app.use("/api/stamps", stampRouter);
app.use("/api/posts", postRouter);
app.use("/api/cart", cartRouter);

app.set('trust proxy', true);

app.get("/api/ip-location", async (req, res) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

    try {
        const geoRes = await fetch(`https://api.ip2location.io/?key=CCB8CF9C3E7B0AD0B36DF4EF2AB7DE3C&ip=${ip}`);
        const geoData = await geoRes.json();

        res.json({
            ip,
            location: geoData,
        });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch location info" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});