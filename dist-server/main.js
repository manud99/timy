import express from "express";
import ViteExpress from "vite-express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
const port = parseInt(process.env.PORT || "80", 10);
app.get("/message", (_, res) => res.send("Hello from express!"));
ViteExpress.listen(app, port, () => console.log(`Server is listening on port ${port} ...`));
