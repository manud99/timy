import prisma from "./prisma.js";

export async function getTimeEntries(start: Date, limit: number = 200) {
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return await prisma.timeEntry.findMany({
        take: limit,
        where: {
            start: { gte: start },
            end: { lt: end },
        },
        orderBy: { start: "asc" },
        include: { subject: true },
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
