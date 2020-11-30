export interface Type<T> extends Function {
    new(...args: any[]): T;
}

export function parseDto<T>(domain: Type<T>, dto: any): T {
    const instance = Object.create(domain.prototype);
    instance.state = dto;
    return instance as T;
}

export function parseDtoArray<T>(domain: Type<T>, array: Array<any>): Array<T> {
    return array.map((item: any) => parseDto<T>(domain, item));
}

export function toDto<T>(domain: any): T {
    return domain.state as T;
}
