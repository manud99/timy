import { NextFunction, Request, Response } from "express";
import { all as getSubjects } from "../db/subjects";

export async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const subjects = await getSubjects();

        return res.json(subjects);
    } catch (error) {
        return next(error);
    }
}
