export type TimeEntry = {
    id: number;
    description: string;
    subjectId: number;
    start: Date | string;
    end: Date | string;
};
