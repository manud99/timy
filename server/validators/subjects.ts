import { NextFunction, Request, Response } from "express";
import type { ValidationError } from "../../@types/ValidationErrors";
import { validateRequired, validateNumber, validateInArray } from "./base.js";

function validateSubject(request: Request, errors: ValidationError[]) {
    // name
    validateRequired(request.body.name, errors, "name", "Name darf nicht leer sein");

    // color
    validateRequired(request.body.color, errors, "color", "Farbe darf nicht leer sein");
    if (!validateNumber(request.body.color, errors, "color", "Farbe muss eine Zahl sein")) return;
    validateInArray(
        parseInt(request.body.color, 10),
        [...Array(8).keys()].map((i) => i + 1),
        errors,
        "color",
        "Farbe muss eine Zahl zwischen 1 und 8 sein."
    );
}

function isValidSubjectId(request: Request) {
    const subjectId = request.params.subjectId;
    return subjectId && /^\d+$/.test(subjectId);
}

export async function validateCreateRequest(request: Request, response: Response, next: NextFunction) {
    const errors: ValidationError[] = [];

    validateSubject(request, errors);

    if (errors.length > 0) {
        return response.status(422).json({ errors });
    }

    next();
}

export async function validateUpdateRequest(request: Request, response: Response, next: NextFunction) {
    const errors: ValidationError[] = [];

    if (!isValidSubjectId(request)) {
        return response.status(404).json("Subject ID hat kein gültiges Format");
    }

    validateSubject(request, errors);

    if (errors.length > 0) {
        return response.status(422).json({ errors });
    }

    next();
}

export async function validateDeleteRequest(request: Request, response: Response, next: NextFunction) {
    if (!isValidSubjectId(request)) {
        return response.status(404).json("Subject ID hat kein gültiges Format");
    }

    next();
}
