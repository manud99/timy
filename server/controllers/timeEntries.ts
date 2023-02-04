import { NextFunction, Request, Response } from "express";
import { getTimeEntries } from "../db/timeEntries";

export async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const timeEntries = await getTimeEntries();

        return res.json(timeEntries);
    } catch (error) {
        return next(error);
    }
}
