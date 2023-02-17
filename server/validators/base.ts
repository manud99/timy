import { ValidationError } from "../../@types/ValidationErrors";

export function validateRequired(data: any, errors: ValidationError[], field: string, message: string): boolean {
    if (!data) {
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
