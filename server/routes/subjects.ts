import { Router } from "express";
import { get, create, update, remove } from "../controllers/subjects";

const router = Router();

router.get("/", get);
router.post("/", create);
router.put("/:subjectId", update);
router.delete("/:subjectId", remove);

export default router;
