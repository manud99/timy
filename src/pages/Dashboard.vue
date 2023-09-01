<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import { TimeEntry } from "../@types/models";
import { getCalendarId } from "../utils/settings";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import Button, { ButtonSize } from "../components/Button.vue";
import Calendar from "../components/Calendar.vue";
import Table from "../components/Table.vue";
import type { Field } from "../components/Table.vue";
import Tabs from "../components/Tabs.vue";
import type { Tab } from "../components/Tabs.vue";
import WeekSlider from "../components/WeekSlider.vue";
import IconGarbage from "../icons/Garbage.vue";
import IconPencil from "../icons/Pencil.vue";
import IconPlus from "../icons/Plus.vue";
import EditTimeEntryModal from "../modals/EditTimeEntryModal.vue";
import { getDate, getTime, getWeekStart } from "../utils/date";
import { firstOpened } from "../utils/firstOpened";
import {
    timeEntries,
    activeWeek,
    calendarId,
    weekStart,
    weekEnd,
    getTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
} from "../utils/timeEntries";

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
    { id: "week", label: "Woche" },
];
const activeTab: Ref<string> = ref("list");

function getQueryParam(key: string) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
}

function updateQueryParam(key: string, value: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    window.history.replaceState(null, "", window.location.pathname + "?" + searchParams.toString());
}

function toLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function changeWeek(addDays: number) {
    const date = new Date(activeWeek.value);
    date.setDate(date.getDate() + addDays);
    activeWeek.value = date.toISOString();
    updateQueryParam("weekStart", toLocalDate(date));
    getTimeEntries();
}

// Show various modals
const showModal: Ref<boolean> = ref(false);
const activeTimeEntry: Ref<TimeEntry | null> = ref(null);

function showCreateModal() {
    activeTimeEntry.value = null;
    showModal.value = true;
}

function showUpdateModal(timeEntry: TimeEntry) {
    activeTimeEntry.value = timeEntry;
    showModal.value = true;
}

onMounted(() => {
    activeTab.value = getQueryParam("tab") || activeTab.value;
    const weekStart = getQueryParam("weekStart");
    if (weekStart) {
        activeWeek.value = new Date(weekStart).toISOString();
    }
    // Set activeWeek to a Monday.
    activeWeek.value = getWeekStart(activeWeek.value).toISOString();

    calendarId.value = getCalendarId();
    getTimeEntries();
});
</script>

<template>
    <Page title="Übersicht">
        <Section class="flex justify-between items-center p-4 bg-white">
            <div class="font-semibold text-gray-600 text-lg">Heute ist ein schöner Tag, mach was Gutes daraus!</div>
            <div class="flex items-center">
                <div v-if="firstOpened" class="text-sm text-gray-600 mr-2">
                    Heute geöffnet um: {{ getTime(firstOpened) }}
                </div>
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
            </div>
        </Section>

        <Section>
            <Tabs
                v-model="activeTab"
                @update:modelValue="(value: string) => updateQueryParam('tab', value)"
                :tabs="tabs"
            />

            <template v-if="activeTab === 'list'">
                <WeekSlider
                    :active-week="activeWeek"
                    :week-start="weekStart"
                    :week-end="weekEnd"
                    @update="(val) => changeWeek(val)"
                />

                <Table :fields="fields" :values="timeEntries">
                    <template #cell(subject)="{ entry }">
                        <SubjectTag v-if="entry.subject" :subject="entry.subject" />
                    </template>
                    <template #cell(day)="row"> {{ getDate(row.entry.start) }}</template>
                    <template #cell(time)="row">
                        {{ getTime(row.entry.start) }} – {{ getTime(row.entry.end) }}</template
                    >
                    <template #cell(actions)="{ entry }">
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
                            <Button :size="ButtonSize.SM" label="Löschen" @click="deleteTimeEntry(entry as TimeEntry)">
                                <IconGarbage class="lg:mr-2" :size="12" />
                                <span class="hidden lg:inline">Löschen</span>
                            </Button>
                        </div>
                    </template>
                </Table>
            </template>

            <div v-else-if="activeTab === 'week'">
                <WeekSlider
                    :active-week="activeWeek"
                    :week-start="weekStart"
                    :week-end="weekEnd"
                    @update="(val) => changeWeek(val)"
                />

                <Calendar
                    :values="timeEntries"
                    :week-start="weekStart"
                    @update="updateTimeEntry"
                    @delete="deleteTimeEntry"
                />
            </div>
        </Section>
    </Page>

    <EditTimeEntryModal
        :timeEntry="activeTimeEntry"
        :show="showModal"
        @close="showModal = false"
        @create="
            (timeEntry) => {
                showModal = false;
                createTimeEntry(timeEntry);
            }
        "
        @update="
            (timeEntry) => {
                showModal = false;
                updateTimeEntry(timeEntry);
            }
        "
    />
</template>
