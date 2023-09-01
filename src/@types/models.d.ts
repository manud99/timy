/**
 * Model TimeEntry
 *
 */
export interface TimeEntry {
    id: string;
    description: string;
    subject: Subject | null;
    start: string;
    end: string;
}

/**
 * Model Subject
 *
 */
export interface Subject {
    name: string;
    color: number;
    isActive: boolean;
}
