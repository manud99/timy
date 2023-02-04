import { Router } from "express";
import { get } from "../controllers/subjects";

const router = Router();

router.get("/", get);

export default router;
