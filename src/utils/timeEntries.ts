import { computed, onMounted, ref, Ref, watch } from "vue";
import { TimeEntry } from "../@types/models";
import { navigate } from "./routing";
import { ready } from "../google/plugin";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../google/query";
import { getWeekStart } from "./date";

export const timeEntries: Ref<TimeEntry[]> = ref([]);
export const activeWeek: Ref<string> = ref(new Date().toISOString());
export const calendarId: Ref<string | null> = ref(null);
export const loading: Ref<boolean> = ref(false);

export const weekStart = computed(() => {
    const date = getWeekStart(activeWeek.value);
    return date.toISOString();
});

export const weekEnd = computed(() => {
    const date = getWeekStart(activeWeek.value);
    date.setDate(date.getDate() + 7);
    return date.toISOString();
});

export function makeSureCalendarIdExists() {
    if (!calendarId.value) {
        navigate("settings");
        return false;
    }
    return true;
}

export async function getTimeEntries() {
    if (!makeSureCalendarIdExists() || !ready || !ready.value) return;

    loading.value = true;

    timeEntries.value = await fetchEvents(calendarId.value!, weekStart.value, weekEnd.value);

    loading.value = false;
}

function findSortedIndex(entry: TimeEntry) {
    const sortedIndex = timeEntries.value.findIndex((record) => record.start > entry.start);
    return sortedIndex >= 0 ? sortedIndex : timeEntries.value.length;
}

export async function createTimeEntry(timeEntry: TimeEntry) {
    if (!makeSureCalendarIdExists() || !ready || !ready.value) return;

    const entry = await createEvent(calendarId.value!, timeEntry);
    if (!entry) {
        console.warn("Event was not created");
        return;
    }

    timeEntries.value.splice(findSortedIndex(entry), 0, entry);
}

export async function updateTimeEntry(timeEntry: TimeEntry) {
    if (!makeSureCalendarIdExists() || !ready || !ready.value) return;

    const entry = await updateEvent(calendarId.value!, timeEntry.id, timeEntry);
    if (!entry) {
        console.warn("Event was not updated");
        return;
    }

    const index = timeEntries.value.findIndex((el) => el.id === timeEntry.id);
    timeEntries.value.splice(index, 1);
    timeEntries.value.splice(findSortedIndex(entry), 0, entry);
}

export async function deleteTimeEntry(timeEntry: TimeEntry) {
    if (!makeSureCalendarIdExists() || !ready || !ready.value) return;

    const entry = await deleteEvent(calendarId.value!, timeEntry.id);
    if (!entry) {
        console.warn("Event was not deleted");
        return;
    }

    const index = timeEntries.value.findIndex((el) => el.id === timeEntry.id);
    timeEntries.value.splice(index, 1);
}
