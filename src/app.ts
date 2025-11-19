import express, { type Request, type Response } from "express"; // import express package
import cors from "cors";

import apiRoutes from "./routes";
// import { errorHandler } from './middlewares';

const app = express(); // instantiate the express server

app.use(cors()); // This enables CORS for all origins and methods
app.use(express.json());
app.use("/voice-api", apiRoutes);

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong from Jinah");
});

// app.use(errorHandler);

export default app;
