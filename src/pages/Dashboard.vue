<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import Axios from "axios";
import Page from "../components/Page.vue";
import Section from "../components/Section.vue";
import Button, {ButtonSize} from "../components/Button.vue";
import Table from "../components/Table.vue";
import type {TimeEntry} from "../../node_modules/.prisma/client";

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
    return new Date(date).toLocaleString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' });
}

function getTime(start: string, end: string): string {
    const startTime = new Date(start).toLocaleString('de-CH', {'timeStyle': 'short'});
    const endTime = new Date(end).toLocaleString('de-CH', {'timeStyle': 'short'});
    return `${startTime} – ${endTime}`
}

onMounted(async () => {
    timeEntries.value = await getTimeEntries();
});
</script>

<template>
    <Page title="Dashboard">
        <Button class="mb-6" label="Neuer Eintrag" :size="ButtonSize.XL" color="green" fullWidth />

        <Section title="Einträge">
            <Table :fields="fields" :values="timeEntries">
                <template #cell(subject)="row"> {{ row.entry.subjectId }} </template>
                <template #cell(day)="row"> {{ getDate(row.entry.start) }} </template>
                <template #cell(time)="row"> {{ getTime(row.entry.start, row.entry.end) }} </template>
                <template #cell(actions)>
                    <Button class="mr-2" :size="ButtonSize.SM" label="Bearbeiten" />
                    <Button :size="ButtonSize.SM" label="Löschen" />
                </template>
            </Table>
        </Section>
    </Page>
</template>
