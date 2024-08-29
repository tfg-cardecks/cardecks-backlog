import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";

//local imports
import authRoutes from "./routes/auth.routes";
import cardRoutes from "./routes/card.routes";
import deskRoutes from "./routes/desk.routes";

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api", cardRoutes);
app.use("/api", deskRoutes);

export default app;
