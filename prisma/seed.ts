import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const data = {
        subjects: [
            { name: "Deutsch", color: 1 },
            { name: "Englisch", color: 2 },
            { name: "Französisch", color: 3 },
            { name: "Mathematik", color: 4 },
            { name: "Physik", color: 5 },
            { name: "Chemie", color: 6 },
            { name: "Biologie", color: 6 },
            { name: "Geografie", color: 7 },
            { name: "Geschichte", color: 8 },
        ],
    };

    const subjects = await Promise.all(
        data.subjects.map(async (subject, index) => {
            return await prisma.subject.create({
                data: {
                    ...subject,
                    isActive: index % 2 == 0,
                },
            });
        })
    );

    let date = new Date();
    const now = new Date();
    date.setDate(date.getDate() - date.getDay() + 1 - 7); // Monday of the last week

    const descriptions = ["Vorlesung", "Übungsstunde", "Hausaufgaben", "Lernen", "Projekt"];
    while (date.getDate() < now.getDate()) {
        await Promise.all(
            [8, 10, 14, 16].map(async (num) => {
                const start = new Date(date);
                const end = new Date(date);

                start.setHours(num, 15, 0, 0);
                end.setHours(num + 2, 0, 0, 0);

                return await prisma.timeEntry.create({
                    data: {
                        subjectId: subjects[Math.floor((Math.random() * subjects.length) / 2) * 2].id,
                        description: descriptions[Math.floor(Math.random() * descriptions.length)],
                        start,
                        end,
                    },
                });
            })
        );

        date.setDate(date.getDate() + 1);
    }
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
