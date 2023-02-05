import prisma from "./prisma";

export async function all(limit: number = 20) {
    return await prisma.subject.findMany({
        take: limit,
        orderBy: {},
    });
}

interface CreateFields {
    name: string;
}

export async function create(subject: number, data: CreateFields) {
    return await prisma.subject.create({
        data: {
            ...data,
        },
    });
}

interface UpdateFields {
    name: string;
}

export async function update(subjectId: number, data: UpdateFields) {
    return await prisma.subject.update({
        where: { id: subjectId },
        data: {
            ...data,
        },
    });
}

export async function remove(subjectId: number) {
    return await prisma.subject.delete({
        where: { id: subjectId },
    });
}
