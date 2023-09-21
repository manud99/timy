import { Ref, ref } from "vue";
import { ValidationError } from "../@types/ValidationErrors";
import CustomDate from "./CustomDate";

export enum RuleType {
    Required = 1,
    Date = 2,
    Custom = 3,
}

interface Record {
    [key: string]: any;
}

interface Rule {
    field: string;
    type: RuleType;
    message?: string;
    callback?: (record: Record) => boolean;
}

function validateRequired(record: Record, rule: Rule) {
    return !!record[rule.field];
}

function validateDate(record: Record, rule: Rule) {
    return record[rule.field] && record[rule.field] instanceof CustomDate && record[rule.field].isValidDate();
}

function validateCustom(record: Record, rule: Rule) {
    return rule.callback && rule.callback(record);
}

export const validationErrors: Ref<ValidationError[]> = ref([]);

const ruleTypeMap = {
    [RuleType.Required]: { fn: validateRequired, message: (field: string) => `Das Feld ${field} ist erforderlich` },
    [RuleType.Date]: { fn: validateDate, message: (field: string) => `Das Feld ${field} muss ein gültiges Datum sein` },
    [RuleType.Custom]: { fn: validateCustom, message: (field: string) => `Das Feld ${field} ist ungültig` },
};

export function validate(record: Record, rules: Rule[]): boolean {
    validationErrors.value = [];
    rules.forEach((rule) => {
        const { fn, message } = ruleTypeMap[rule.type];
        if (!fn(record, rule)) {
            validationErrors.value.push({
                field: rule.field,
                message: message(rule.field) || `Das Feld ${rule.field} ist erforderlich`,
            });
        }
    });

    return validationErrors.value.length === 0;
}
