import express from "express";
import timeEntriesRouter from "./routes/timeEntries";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.use("/api/time-entries", timeEntriesRouter);

export default app;
