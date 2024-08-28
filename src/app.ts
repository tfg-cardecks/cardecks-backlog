import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";

//local imports
import authRoutes from "./routes/auth.routes";

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

export default app;
