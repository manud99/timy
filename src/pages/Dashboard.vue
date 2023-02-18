<script setup lang="ts">
import type {Ref} from "vue";
import {computed, onMounted, reactive, ref} from "vue";
import Axios from "axios";
import type {TimeEntry} from "../../@types/models";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import Button, {ButtonSize} from "../components/Button.vue";
import Table from "../components/Table.vue";
import IconPlus from "../icons/Plus.vue";
import IconPencil from "../icons/Pencil.vue";
import IconGarbage from "../icons/Garbage.vue";
import IconArrowLeft from "../icons/ArrowLeft.vue";
import IconArrowRight from "../icons/ArrowRight.vue";

const fields = [
    {
        id: "day",
        label: "Datum",
    },
    {
        id: "time",
        label: "Zeit",
    },
    {
        id: "description",
        label: "Beschreibung",
    },
    {
        id: "subject",
        label: "Fach",
    },
    {
        id: "actions",
        label: "Aktionen",
    },
];

const timeEntries: Ref<TimeEntry[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const activeWeek: Date = reactive(new Date());

// Source: https://weeknumber.com/how-to/javascript
const weekNumber = computed(() => {
    const date = new Date(activeWeek);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
});

const weekStart = computed(() => {
    const date = new Date(activeWeek);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay() + 1);
    return getDate(date.toISOString());
});

const weekEnd = computed(() => {
    const date = new Date(activeWeek);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay() + 8);
    return getDate(date.toISOString());
});

function getDate(date: string): string {
    return new Date(date).toLocaleString("de-CH", {day: "2-digit", month: "long", year: "numeric"});
}

function getTime(start: string, end: string): string {
    const startTime = new Date(start).toLocaleString("de-CH", {timeStyle: "short"});
    const endTime = new Date(end).toLocaleString("de-CH", {timeStyle: "short"});
    return `${startTime} – ${endTime}`;
}

function changeWeek(addDays: number) {
    activeWeek.setDate(activeWeek.getDate() + addDays);
    getTimeEntries();
}

async function getTimeEntries() {
    loading.value = true;
    const date = activeWeek.toISOString();

    try {
        timeEntries.value = (await Axios.get(`/api/time-entries?date=${date}`)).data;
        loading.value = false;
    } catch (error) {
        loading.value = false;
        console.error(error);
    }
}

onMounted(() => {
    activeWeek.setHours(0, 0, 0, 0);
    activeWeek.setDate(activeWeek.getDate() - activeWeek.getDay() + 1);
    getTimeEntries();
});
</script>

<template>
    <Page title="Übersicht">
        <Section class="flex justify-between items-center p-4 bg-white">
            <div class="font-semibold text-gray-600 text-lg">Heute ist ein schöner Tag, mach was Gutes draus!</div>
            <Button class="flex items-center" label="Neues Eintrag erstellen" :size="ButtonSize.LG" color="blue">
                <IconPlus class="mr-2" :size="12"/>
                <span>Neuer Eintrag erstellen</span>
            </Button>
        </Section>

        <Section>
            <div class="grid md:grid-cols-4 gap-4 items-center bg-white text-gray-600 font-semibold border-b px-4 py-3">
                <div>
                    <Button class="" :size="ButtonSize.MD" label="Woche zurück" @click="changeWeek(-7)">
                        <IconArrowLeft class="mr-2" :size="12" />
                        <span>Woche {{ (weekNumber - 1) % 53 }}</span>
                    </Button>
                </div>
                <div class="md:col-span-2 md:text-center">Woche {{ weekNumber }} – vom {{ weekStart }} bis {{ weekEnd }}</div>
                <div class="md:text-right">
                    <Button class="" :size="ButtonSize.MD" label="Woche zurück" @click="changeWeek(7)">
                        <span>Woche {{ (weekNumber + 1) % 53 }}</span>
                        <IconArrowRight class="ml-2" :size="12" />
                    </Button>
                </div>
            </div>

            <Table :fields="fields" :values="timeEntries">
                <template #cell(subject)="{ entry }">
                    <SubjectTag :subject="entry.subject"/>
                </template>
                <template #cell(day)="row"> {{ getDate(row.entry.start) }}</template>
                <template #cell(time)="row"> {{ getTime(row.entry.start, row.entry.end) }}</template>
                <template #cell(actions)>
                    <div class="flex">
                        <Button class="mr-2" :size="ButtonSize.SM" label="Bearbeiten">
                            <IconPencil class="mr-2" :size="16"/>
                            <span>Bearbeiten</span>
                        </Button>
                        <Button :size="ButtonSize.SM" label="Löschen">
                            <IconGarbage class="mr-2" :size="12"/>
                            <span>Löschen</span>
                        </Button>
                    </div>
                </template>
            </Table>
        </Section>
    </Page>
</template>
