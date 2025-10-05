import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./database/dbconnect.js";
import cookieParser from "cookie-parser";
import userRoute from './routes/user.route.js'
import aiRoute from './routes/ai.route.js'
import projectRoute from './routes/project.route.js'
const app = express();
dotenv.config();
const PORT = 5000 || process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials:true
  })
);
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({limit:'10mb',extended:true}))
app.use(cookieParser());

app.use('/api/authentication',userRoute);
app.use('/api/ai',aiRoute);
app.use('/api/project',projectRoute);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Listening to PORT: ${PORT}`));
});
