import { Router } from "express";
import { get } from "../controllers/timeEntries";

const router = Router();

router.get("/", get);

export default router;
