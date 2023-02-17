import { Router } from "express";
import { get } from "../controllers/timeEntries.js";

const router = Router();

router.get("/", get);

export default router;
