import { Router } from "express";
import * as subjectController from "../controllers/subjects";
import { validateCreateRequest, validateUpdateRequest, validateDeleteRequest } from "../validators/subjects";

const router = Router();

router.get("/", subjectController.get);
router.post("/", validateCreateRequest, subjectController.create);
router.put("/:subjectId", validateUpdateRequest, subjectController.update);
router.delete("/:subjectId", validateDeleteRequest, subjectController.remove);

export default router;
