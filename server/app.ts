import express, { Request, Response } from "express";
import timeEntriesRouter from "./routes/timeEntries";
import subjectsRouter from "./routes/subjects";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.use("/api/time-entries", timeEntriesRouter);
app.use("/api/subjects", subjectsRouter);

export default app;
