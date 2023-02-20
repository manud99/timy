import { Router } from "express";
import { get } from "../controllers/timeEntries.js";
import { validateGetRequest } from "../validators/timeEntries.js";

const router = Router();

router.get("/", validateGetRequest, get);

export default router;
