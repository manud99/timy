interface IModel {
    id?: number,
}

interface ITimeEntry extends IModel {
    title?: string,
    time?: number,
    start?: string,
    type?: number,
    duration?: string,
    created_at?: string,
    updated_at?: string,
}
