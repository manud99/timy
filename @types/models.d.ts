/**
 * Model TimeEntry
 *
 */
export type TimeEntry = {
    id: number;
    description: string;
    subjectId: number;
    start: Date | string;
    end: Date | string;
};

/**
 * Model Subject
 *
 */
export type Subject = {
    id: number;
    name: string;
    color: number;
    isActive: boolean;
};
