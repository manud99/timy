import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const subject1 = await prisma.subject.create({
        data: {
            name: "Subject One",
            color: 1,
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
    const subject2 = await prisma.subject.create({
        data: {
            name: "Subject Two",
            color: 2,
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
