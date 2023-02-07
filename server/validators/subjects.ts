import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../@types/ValidationErrors";

export async function validateCreateRequest(request: Request, response: Response, next: NextFunction) {
    const errors: ValidationError[] = [];

    // name: required
    if (!request.body.name) {
        errors.push({ message: "Name darf nicht leer sein." });
    }

    if (errors.length > 0) {
        return response.status(422).json({ errors });
    }

    next();
}

export async function validateUpdateRequest(request: Request, response: Response, next: NextFunction) {
    const errors: ValidationError[] = [];

    // id: required
    const subjectId = request.params.subjectId;
    if (!subjectId || !Number.isInteger(subjectId)) {
        return response.status(404).json("Subject not found");
    }

    // name: required
    if (!request.body.name) {
        errors.push({ message: "Name darf nicht leer sein." });
    }

    if (errors.length > 0) {
        return response.status(422).json({ errors });
    }

    next();
}

export async function validateDeleteRequest(request: Request, response: Response, next: NextFunction) {
    // id: required
    const subjectId = request.params.subjectId;
    if (!subjectId || !Number.isInteger(subjectId)) {
        return response.status(404).json("Subject not found");
    }

    next();
}
