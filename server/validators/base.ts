import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../@types/ValidationErrors";

export function validate(
    req: Request,
    res: Response,
    next: NextFunction,
    callback: (errors: ValidationError[]) => void
) {
    const errors: ValidationError[] = [];

    callback(errors);

    if (errors.length > 0) {
        res.status(422).json({ errors });
    } else {
        next();
    }
}

export function validateRequired(data: any, errors: ValidationError[], field: string, message: string): boolean {
    if (data === undefined || data === null || data === "") {
        errors.push({ field, message });
        return false;
    }
    return true;
}

export function validateNumber(number: any, errors: ValidationError[], field: string, message: string): boolean {
    if (!/^\d+$/.test(number)) {
        errors.push({ field, message });
        return false;
    }
    return true;
}

export function validateBoolean(data: any, errors: ValidationError[], field: string, message: string): boolean {
    if (data !== true && data !== false) {
        errors.push({ field, message });
        return false;
    }
    return true;
}

export function validateDate(data: any, errors: ValidationError[], field: string, message: string) {
    if (
        typeof data !== "string" ||
        !/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(data as string)
    ) {
        errors.push({ field, message });
        return false;
    }
    return true;
}

export function validateInArray(
    data: any,
    array: any[],
    errors: ValidationError[],
    field: string,
    message: string
): boolean {
    if (!array.includes(data)) {
        errors.push({ field, message });
        return false;
    }
    return true;
}
