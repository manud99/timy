<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { Subject, TimeEntry } from "../@types/models";
import { getCalendarId } from "../utils/settings";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import Button, { ButtonSize } from "../components/Button.vue";
import Calendar from "../components/Calendar.vue";
import Tabs from "../components/Tabs.vue";
import type { Tab } from "../components/Tabs.vue";
import WeekSlider from "../components/WeekSlider.vue";
import IconPlus from "../icons/Plus.vue";
import IconReload from "../icons/Reload.vue";
import EditTimeEntryModal from "../modals/EditTimeEntryModal.vue";
import CustomDate from "../utils/CustomDate";
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
import { readyToFetch } from "../google/plugin";
import { getQueryParam, updateQueryParam } from "../utils/queryParams";
import EditSubjectModal from "../modals/EditSubjectModal.vue";
import { updateSubject } from "../utils/subjects";
import List from "../components/List.vue";
import { startTime, setStartTime } from "../utils/timeKeeper";

const tabs: Tab[] = [
    { id: "list", label: "Liste" },
    { id: "week", label: "Woche" },
];
const activeTab: Ref<string> = ref("list");

function toLocalDate(date: CustomDate) {
    const year = date.getYear();
    const month = date.getMonth().toString().padStart(2, "0");
    const day = date.getDay().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function changeWeek(amountOfDays: number) {
    const date = activeWeek.value.addDays(amountOfDays);
    activeWeek.value = date;
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

function resetStartTime() {
    setStartTime(CustomDate.now());
}

onMounted(() => {
    activeTab.value = getQueryParam("tab") || activeTab.value;
    const weekStart = getQueryParam("weekStart");
    if (weekStart) {
        activeWeek.value = new CustomDate(weekStart);
    }
    // Set activeWeek to a Monday.
    activeWeek.value = activeWeek.value.setToWeekStart();

    calendarId.value = getCalendarId();
    getTimeEntries();

    document.addEventListener("keypress", onKeyPress);
});

onUnmounted(() => {
    document.removeEventListener("keypress", onKeyPress);
});

if (readyToFetch) {
    watch(readyToFetch, () => {        
        getTimeEntries();
    });
}
</script>

<template>
    <Page title="Übersicht">
        <Section class="flex flex-wrap gap-4 justify-between items-center p-4 bg-white">
            <div class="font-semibold text-gray-600 text-lg">Heute ist ein schöner Tag, mach was Gutes daraus!</div>
            <div class="flex flex-wrap gap-2 items-center">
                <div v-if="startTime" class="text-sm text-center text-gray-600">
                    Gestartet um: {{ startTime.getTime() }}<br />
                </div>
                <Button
                    class="flex justify-center items-center w-full md:w-auto"
                    color="green"
                    :size="ButtonSize.LG"
                    label="Jetzt neu starten"
                    @click="resetStartTime"
                >
                    <IconReload class="mr-2" :size="16" />
                    Jetzt neu starten
                </Button>
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
                <WeekSlider :week-start="weekStart" :week-end="weekEnd" @update="(val) => changeWeek(val)" />
                <List
                    :time-entries="timeEntries"
                    :loading="loading"
                    :active-week="activeWeek"
                    @edit="showUpdateModal"
                    @delete="deleteTimeEntry"
                    @edit-subject="editSubject"
                />
            </template>

            <template v-else-if="activeTab === 'week'">
                <WeekSlider :week-start="weekStart" :week-end="weekEnd" @update="(val) => changeWeek(val)" />
                <Calendar
                    :values="timeEntries"
                    :week-start="weekStart"
                    @edit="showUpdateModal"
                    @update="updateTimeEntry"
                    @delete="deleteTimeEntry"
                />
            </template>
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
