import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    await prisma.subject.create({
        data: {
            name: "Gelb",
            color: 1,
            isActive: true,
            timeEntries: {
                create: [
                    {
                        description: "Lecture",
                        start: new Date("2023-02-04T10:15:00"),
                        end: new Date("2023-02-04T12:00:00"),
                    },
                ],
            },
        },
    });
    await prisma.subject.create({
        data: {
            name: "Rot",
            color: 2,
            isActive: false,
            timeEntries: {
                create: [
                    {
                        description: "Lecture",
                        start: new Date("2023-02-04T08:15:00"),
                        end: new Date("2023-02-04T10:00:00"),
                    },
                    {
                        description: "Exercise Session",
                        start: new Date("2023-02-04T14:15:00"),
                        end: new Date("2023-02-04T16:00:00"),
                    },
                ],
            },
        },
    });
    await prisma.subject.create({
        data: {
            name: "Pink",
            color: 3,
            isActive: false,
        },
    });
    await prisma.subject.create({
        data: {
            name: "Violett",
            color: 4,
            isActive: false,
        },
    });
    await prisma.subject.create({
        data: {
            name: "Türkis",
            color: 5,
            isActive: false,
        },
    });
    await prisma.subject.create({
        data: {
            name: "Hellgelb",
            color: 6,
            isActive: false,
        },
    });
    await prisma.subject.create({
        data: {
            name: "Dunkelgrün",
            color: 7,
            isActive: false,
        },
    });
    await prisma.subject.create({
        data: {
            name: "Hellgrün",
            color: 8,
            isActive: false,
        },
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
