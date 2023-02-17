import express, { Request, Response } from "express";
import timeEntriesRouter from "./routes/timeEntries.js";
import subjectsRouter from "./routes/subjects.js";

const app = express();

app.use(express.json());

app.use("/api/time-entries", timeEntriesRouter);
app.use("/api/subjects", subjectsRouter);

export default app;
