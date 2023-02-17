import { NextFunction, Request, Response } from "express";
import type { ValidationError } from "../../@types/ValidationErrors";
import { COLOR } from "../enums/colors.js";

export async function validateCreateRequest(request: Request, response: Response, next: NextFunction) {
    const errors: ValidationError[] = [];

    // name: required
    if (!request.body.name) {
        errors.push({ message: "Name darf nicht leer sein." });
    }

    // color: required|in:Enum:Color
    if (!request.body.color) {
        errors.push({ message: "Farbe darf nicht leer sein." });
    } else if (!Object.keys(COLOR).includes(request.body.color)) {
        errors.push({ message: "Farbe ist ungültig." });
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
    if (!subjectId || !/^\d+$/.test(subjectId)) {
        console.error(subjectId, "is invalid");
        return response.status(404).json("Subject ID hat kein gültiges Format");
    }

    // name: required
    if (!request.body.name) {
        errors.push({ message: "Name darf nicht leer sein." });
    }

    // color: required|number|in:Enum:Color
    if (!request.body.color) {
        errors.push({ message: "Farbe darf nicht leer sein." });
    } else if (!/^\d+$/.test(request.body.color)) {
        errors.push({ message: "Farbe muss eine Zahl sein" });
    } else if (!Object.values(COLOR).includes(parseInt(request.body.color, 10))) {
        console.log(Object.values(COLOR), request.body.color, Object.values(COLOR).includes(request.body.color));
        errors.push({ message: "Farbe ist ungültig." });
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
