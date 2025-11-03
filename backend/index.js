import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./database/dbconnect.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import aiRoute from "./routes/ai.route.js";
import projectRoute from "./routes/project.route.js";
import chatRoute from "./routes/chat.route.js";
import testRoute from "./routes/sample.js"


const app = express();

dotenv.config();
const PORT =process.env.PORT;

app.use(
  cors({
    origin: ["https://code-doc-ai-theta.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.get("/",(req,res)=>{res.status(200).send("CodeDOC AI ")})

app.use("/api/authentication", userRoute);
app.use("/api/ai", aiRoute);
app.use("/api/project", projectRoute);
app.use("/api/chat", chatRoute);
app.use("/api/test",testRoute)
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Listening to PORT: ${PORT}`));
});
