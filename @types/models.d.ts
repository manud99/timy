/**
 * Model TimeEntry
 *
 */
export type TimeEntry = {
    id: number;
    description: string;
    subjectId: number;
    start: Date;
    end: Date;
};

/**
 * Model Subject
 *
 */
export type Subject = {
    id: number;
    name: string;
};
