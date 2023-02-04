import prisma from "./prisma";

export async function getTimeEntries(limit: number = 20) {
    return await prisma.timeEntry.findMany({
        take: limit,
        orderBy: { start: "desc" },
    });
}

export async function createTimeEntry(subject: number, description: string, start: string, end: string) {
    return await prisma.timeEntry.create({
        data: {
            description,
            subjectId: subject,
            start,
            end,
        },
    });
}