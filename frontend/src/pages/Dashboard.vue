<script setup lang="ts">
import type { Ref } from "vue";
import { computed, onMounted, ref } from "vue";
import Axios from "axios";
import type { TimeEntry } from "../../types/TimeEntry";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import EditTimeEntryModal from "../modals/EditTimeEntryModal.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import Button, { ButtonSize } from "../components/Button.vue";
import Table from "../components/Table.vue";
import type { Field } from "../components/Table.vue";
import IconPlus from "../icons/Plus.vue";
import IconPencil from "../icons/Pencil.vue";
import IconGarbage from "../icons/Garbage.vue";
import IconArrowLeft from "../icons/ArrowLeft.vue";
import IconArrowRight from "../icons/ArrowRight.vue";
import Tabs from "../components/Tabs.vue";
import type { Tab } from "../components/Tabs.vue";

const fields: Field[] = [
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

const tabs: Tab[] = [
    { id: "list", label: "Liste" },
    { id: "day", label: "Tag" },
    { id: "week", label: "Woche" },
];

const timeEntries: Ref<TimeEntry[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const showModal: Ref<boolean> = ref(false);
const activeTab: Ref<string> = ref("list");
const activeWeek: Ref<string> = ref(new Date().toISOString());
const activeTimeEntry: Ref<TimeEntry | null> = ref(null);

// Source: https://weeknumber.com/how-to/javascript
const weekNumber = computed(() => {
    const date = new Date(activeWeek.value);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
});

const weekStart = computed(() => {
    const date = getWeekStart();
    return date.toISOString();
});

const weekEnd = computed(() => {
    const date = getWeekStart();
    date.setDate(date.getDate() + 7);
    return date.toISOString();
});

function getWeekStart(): Date {
    const date = new Date(activeWeek.value);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - ((((date.getDay() - 1) % 7) + 7) % 7));
    return date;
}

function getDate(date: string | Date): string {
    return new Date(date).toLocaleString("de-CH", { day: "2-digit", month: "long", year: "numeric" });
}

function getTime(start: string, end: string): string {
    const startTime = new Date(start).toLocaleString("de-CH", { timeStyle: "short" });
    const endTime = new Date(end).toLocaleString("de-CH", { timeStyle: "short" });
    return `${startTime} – ${endTime}`;
}

function changeWeek(addDays: number) {
    const date = new Date(activeWeek.value);
    date.setDate(date.getDate() + addDays);
    activeWeek.value = date.toISOString();
    getTimeEntries();
}

async function getTimeEntries() {
    loading.value = true;

    try {
        timeEntries.value = (await Axios.get(`/api/time-entries?date=${activeWeek.value}`)).data;
        loading.value = false;
    } catch (error) {
        loading.value = false;
        console.error(error);
    }
}

function showCreateModal() {
    activeTimeEntry.value = null;
    showModal.value = true;
}

function showUpdateModal(timeEntry: TimeEntry) {
    activeTimeEntry.value = timeEntry;
    showModal.value = true;
}

function createTimeEntry(timeEntry: TimeEntry) {
    showModal.value = false;
    timeEntries.value.push(timeEntry);
}

function updateTimeEntry(timeEntry: TimeEntry) {
    showModal.value = false;
    const index = timeEntries.value.findIndex((el) => el.id === timeEntry.id);
    timeEntries.value.splice(index, 1, timeEntry);
}

function deleteTimeEntry(index: number) {
    const id = timeEntries.value[index]?.id;
    try {
        // await Axios.delete(`/api/time-entries/${id}`);
        timeEntries.value.splice(index, 1);
    } catch (err) {
        console.error("Could not delete subject", err);
    }
}

onMounted(() => {
    activeWeek.value = getWeekStart().toISOString();
    getTimeEntries();
});
</script>

<template>
    <Page title="Übersicht">
        <Section class="flex justify-between items-center p-4 bg-white">
            <div class="font-semibold text-gray-600 text-lg">Heute ist ein schöner Tag, mach was Gutes draus!</div>
            <Button
                class="flex items-center"
                label="Neues Eintrag erstellen"
                :size="ButtonSize.LG"
                color="blue"
                @click="showCreateModal"
            >
                <IconPlus class="mr-2" :size="12" />
                <span>Neuer Eintrag erstellen</span>
            </Button>
        </Section>

        <Section>
            <Tabs v-model="activeTab" :tabs="tabs" />

            <template v-if="activeTab === 'list'">
                <div
                    class="flex flex-wrap justify-between gap-4 items-center bg-white text-gray-600 font-semibold border-b px-4 py-3"
                >
                    <div class="md:order-1 grow text-center">
                        Woche {{ weekNumber }} vom {{ getDate(weekStart) }} – {{ getDate(weekEnd) }}
                    </div>
                    <div class="md:order-0">
                        <Button :size="ButtonSize.MD" label="Woche zurück" @click="changeWeek(-7)">
                            <IconArrowLeft class="mr-2" :size="12" />
                            <span>Woche {{ (weekNumber - 1) % 53 }}</span>
                        </Button>
                    </div>
                    <div class="order-2 md:text-right">
                        <Button class="" :size="ButtonSize.MD" label="Woche zurück" @click="changeWeek(7)">
                            <span>Woche {{ (weekNumber + 1) % 53 }}</span>
                            <IconArrowRight class="ml-2" :size="12" />
                        </Button>
                    </div>
                </div>

                <Table :fields="fields" :values="timeEntries">
                    <template #cell(subject)="{ entry }">
                        <SubjectTag :subject="entry.subject" />
                    </template>
                    <template #cell(day)="row"> {{ getDate(row.entry.start) }}</template>
                    <template #cell(time)="row"> {{ getTime(row.entry.start, row.entry.end) }}</template>
                    <template #cell(actions)="{ entry, index }">
                        <div class="flex">
                            <Button
                                class="mr-2"
                                :size="ButtonSize.SM"
                                label="Bearbeiten"
                                @click="showUpdateModal(entry as TimeEntry)"
                            >
                                <IconPencil class="lg:mr-2" :size="16" />
                                <span class="hidden lg:inline">Bearbeiten</span>
                            </Button>
                            <Button :size="ButtonSize.SM" label="Löschen" @click="deleteTimeEntry(index)">
                                <IconGarbage class="lg:mr-2" :size="12" />
                                <span class="hidden lg:inline">Löschen</span>
                            </Button>
                        </div>
                    </template>
                </Table>
            </template>

            <div v-else-if="activeTab === 'day'" class="bg-white px-4 py-6 text-xl font-semibold text-center">
                Tages-Ansicht
            </div>

            <div v-else-if="activeTab === 'week'" class="bg-white px-4 py-6 text-xl font-semibold text-center">
                Wochen-Ansicht
            </div>
        </Section>
    </Page>

    <EditTimeEntryModal
        :timeEntry="activeTimeEntry"
        :show="showModal"
        @close="showModal = false"
        @create="createTimeEntry"
        @update="updateTimeEntry"
    />
</template>
