<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { Subject, TimeEntry } from "../@types/models";
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
import { getFullDate, getTime, getWeekStart } from "../utils/date";
import { firstOpened } from "../utils/firstOpened";
import {
    timeEntries,
    loading,
    activeWeek,
    calendarId,
    weekStart,
    weekEnd,
    getTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
} from "../utils/timeEntries";
import { ready } from "../google/plugin";
import { getQueryParam, updateQueryParam } from "../utils/queryParams";
import EditSubjectModal from "../modals/EditSubjectModal.vue";
import { updateSubject } from "../utils/subjects";
import List from "../components/List.vue";

const fields: Field[] = [
    {
        id: "day",
        label: "Datum",
        nowrap: true,
    },
    {
        id: "time",
        label: "Zeit",
        nowrap: true,
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

// Show time entry modal
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

// Show subject modal
const activeSubject: Ref<Subject | null> = ref(null);
const showSubjectModal: Ref<boolean> = ref(false);

function editSubject(subject: Subject) {
    showSubjectModal.value = true;
    activeSubject.value = subject;
}

function onUpdateSubject(subject: Subject) {
    showSubjectModal.value = false;
    updateSubject(subject);
    timeEntries.value.forEach((timeEntry) => {
        if (timeEntry.subject?.name !== subject.name) return;
        timeEntry.subject = subject;
    });
}

function onKeyPress(event: KeyboardEvent) {
    if (event.target !== document.body) return;
    switch (event.key.toLowerCase()) {
        case "n":
            showCreateModal();
            break;
    }
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

    document.addEventListener("keypress", onKeyPress);
});

onUnmounted(() => {
    document.removeEventListener("keypress", onKeyPress);
});

if (ready) {
    watch(ready, () => {
        getTimeEntries();
    });
}
</script>

<template>
    <Page title="Übersicht">
        <Section class="flex flex-wrap gap-4 justify-between items-center p-4 bg-white">
            <div class="font-semibold text-gray-600 text-lg">Heute ist ein schöner Tag, mach was Gutes daraus!</div>
            <div class="flex flex-wrap items-center">
                <div v-if="firstOpened" class="text-sm text-gray-600 md:mr-4 mb-2 md:mb-0">
                    Heute geöffnet um: {{ getTime(firstOpened) }}
                </div>
                <Button
                    class="flex justify-center items-center w-full md:w-auto"
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

                <Table class="hidden md:block" :fields="fields" :values="timeEntries" :loading="loading">
                    <template #cell(subject)="{ entry }">
                        <SubjectTag
                            v-if="entry.subject"
                            class="cursor-pointer"
                            :subject="entry.subject"
                            @dblclick="editSubject(entry.subject)"
                        />
                    </template>
                    <template #cell(day)="row"> {{ getFullDate(row.entry.start) }}</template>
                    <template #cell(time)="row">
                        <span class="whitespace-nowrap"
                            >{{ getTime(row.entry.start) }}&nbsp;&#x2013;&nbsp;{{ getTime(row.entry.end) }}</span
                        >
                    </template>
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
                <List
                    :time-entries="timeEntries"
                    :loading="loading"
                    @edit="showUpdateModal"
                    @delete="deleteTimeEntry"
                    @edit-subject="editSubject"
                />
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
                    @edit="showUpdateModal"
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

    <EditSubjectModal
        :subject="activeSubject"
        :show="showSubjectModal"
        @close="showSubjectModal = false"
        @update="onUpdateSubject"
    />
</template>
