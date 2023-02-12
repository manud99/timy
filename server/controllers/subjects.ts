import { NextFunction, Request, Response } from "express";
import {
    all as getSubjects,
    create as createSubject,
    update as updateSubject,
    remove as deleteSubject,
    exists as doesSubjectExist,
} from "../db/subjects";

export async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const subjects = await getSubjects();
        return res.json(subjects);
    } catch (error) {
        return next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.subjectId, 10);
    const { name } = req.body;
    const color = parseInt(req.body.color);

    try {
        const subject = await createSubject(id, { name, color });

        return res.status(200).json({ subject });
    } catch (error) {
        return next(error);
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.subjectId, 10);
    const { name } = req.body;
    const color = parseInt(req.body.color);

    try {
        if (!(await doesSubjectExist(id))) {
            return res.status(404).json("Subject not found");
        }

        const subject = await updateSubject(id, { name, color });

        return res.status(200).json({ subject });
    } catch (error) {
        return next(error);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.subjectId, 10);

    try {
        await deleteSubject(id);

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
}
