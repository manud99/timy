interface IModel {
    id?: number,
}

interface DbTimeEntry extends IModel {
    title?: string,
    start: number,
    end?: number,
    created_at: number,
    updated_at: number,
}

interface ApiTimeEntry extends IModel {
    title?: string,
    start: string,
    end?: string,
    duration?: number,
    created_at?: string,
    updated_at?: string,
}
