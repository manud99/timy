import CustomDate from "../utils/CustomDate";

/**
 * Model TimeEntry
 *
 */
export interface TimeEntry {
    id: string;
    description: string;
    subject: Subject | null;
    start: CustomDate;
    end: CustomDate;
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
