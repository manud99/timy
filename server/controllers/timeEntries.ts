import { NextFunction, Request, Response } from "express";
import { getTimeEntries } from "../db/timeEntries.js";

export async function get(req: Request, res: Response, next: NextFunction) {
    const date = new Date(req.query.date as string);

    try {
        const timeEntries = await getTimeEntries(date);

        return res.json(timeEntries);
    } catch (error) {
        return next(error);
    }
}
