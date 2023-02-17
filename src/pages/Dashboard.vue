<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import Axios from "axios";
import type { TimeEntry } from "../../@types/models";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import Button, { ButtonSize } from "../components/Button.vue";
import Table from "../components/Table.vue";
import IconPlus from "../icons/Plus.vue";
import IconPencil from "../icons/Pencil.vue";
import IconGarbage from "../icons/Garbage.vue";

const fields = [
    {
        id: "subject",
        label: "Fach",
    },
    {
        id: "description",
        label: "Beschreibung",
    },
    {
        id: "day",
        label: "Datum",
    },
    {
        id: "time",
        label: "Zeit",
    },
    {
        id: "actions",
        label: "Aktionen",
    },
];
let timeEntries: Ref<TimeEntry[]> = ref([]);

async function getTimeEntries(): Promise<Array<TimeEntry>> {
    try {
        return (await Axios.get("/api/time-entries")).data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function getDate(date: string): string {
    return new Date(date).toLocaleString("de-CH", { day: "2-digit", month: "long", year: "numeric" });
}

function getTime(start: string, end: string): string {
    const startTime = new Date(start).toLocaleString("de-CH", { timeStyle: "short" });
    const endTime = new Date(end).toLocaleString("de-CH", { timeStyle: "short" });
    return `${startTime} – ${endTime}`;
}

onMounted(async () => {
    timeEntries.value = await getTimeEntries();
});
</script>

<template>
    <Page title="Übersicht">
        <Section class="flex justify-between items-center p-4 bg-white">
            <div class="font-semibold text-gray-600 text-lg">Heute ist ein schöner Tag, mach was Gutes draus!</div>
            <Button class="flex items-center" label="Neues Eintrag erstellen" :size="ButtonSize.LG" color="blue">
                <IconPlus class="mr-2" :size="12" />
                <span>Neuer Eintrag erstellen</span>
            </Button>
        </Section>

        <Section title="Einträge">
            <Table :fields="fields" :values="timeEntries">
                <template #cell(subject)="{ entry }">
                    <SubjectTag :subject="entry.subject" />
                </template>
                <template #cell(day)="row"> {{ getDate(row.entry.start) }} </template>
                <template #cell(time)="row"> {{ getTime(row.entry.start, row.entry.end) }} </template>
                <template #cell(actions)>
                    <div class="flex">
                        <Button class="mr-2" :size="ButtonSize.SM" label="Bearbeiten">
                            <IconPencil class="mr-2" :size="16" />
                            <span>Bearbeiten</span>
                        </Button>
                        <Button :size="ButtonSize.SM" label="Löschen">
                            <IconGarbage class="mr-2" :size="12" />
                            <span>Löschen</span>
                        </Button>
                    </div>
                </template>
            </Table>
        </Section>
    </Page>
</template>
