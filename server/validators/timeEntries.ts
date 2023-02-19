import { NextFunction, Request, Response } from "express";
import type { ValidationError } from "../../@types/ValidationErrors";
import {validate, validateDate} from "./base.js";

export function validateGetRequest(req: Request, res: Response, next: NextFunction) {
    validate(req, res, next, (errors) => {
        validateDate(req.query.date, errors, "date", "Ungültiges Datumsformat");
    });
}
