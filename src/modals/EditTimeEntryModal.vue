<script setup lang="ts">
import { ref, toRefs, watch, computed, onMounted } from "vue";
import type { Ref } from "vue";
import { TimeEntry } from "../@types/models";
import Modal from "../components/Modal.vue";
import FormGroup from "../components/FormGroup.vue";
import InputField from "../components/InputField.vue";
import { ValidationError } from "../@types/ValidationErrors";
import DateField from "../components/DateField.vue";
import SelectField, { Option } from "../components/SelectField.vue";
import TimeField from "../components/TimeField.vue";
import { getSubject, getSubjects, subjects } from "../utils/subjects";
import { getTime, isOnSameDay, roundedToQuarterHours } from "../utils/date";
import { timeEntries } from "../utils/timeEntries";
import { firstOpened } from "../utils/firstOpened";

const description: Ref<string> = ref("");
const dateStart: Ref<string> = ref("");
const dateEnd: Ref<string> = ref("");
const date: Ref<string> = ref("");
const start: Ref<string> = ref("");
const end: Ref<string> = ref("");
const subject: Ref<string> = ref("");
const errors: Ref<ValidationError[]> = ref([]);

const props = defineProps<{
    show: boolean;
    timeEntry: TimeEntry | null;
}>();
const { show, timeEntry } = toRefs(props);

const emit = defineEmits<{
    (e: "close"): void;
    (e: "create", timeEntry: TimeEntry): void;
    (e: "update", timeEntry: TimeEntry): void;
}>();

function setDateFields(dateStart: string, dateEnd: string) {
    // date is in ISO format
    // e.g. 2023-02-13T09:15:00.000Z
    date.value = dateStart.substring(0, 10);
    start.value = getTime(dateStart);
    end.value = getTime(dateEnd);
}

watch(show, (val) => {
    if (!val) {
        return;
    }
    if (timeEntry.value) {
        description.value = timeEntry.value?.description!;
        subject.value = timeEntry.value?.subject?.name || "";
        setDateFields(timeEntry.value?.start as string, timeEntry.value?.end as string);
    } else {
        description.value = "";
        subject.value = "";

        let start;
        let end = roundedToQuarterHours(new Date());

        const todaysEntries = timeEntries.value.filter((entry) => isOnSameDay(entry.start, end));
        if (todaysEntries.length) {
            start = new Date(todaysEntries[todaysEntries.length - 1].end);
        } else if (firstOpened.value) {
            start = roundedToQuarterHours(new Date(firstOpened.value));
        } else {
            start = new Date(end.valueOf() - 3_600_000);
        }

        if (end.valueOf() - start.valueOf() < 900_000) {
            // Enforce difference of at least 15 minutes
            end = new Date(start.valueOf() + 900_000);
        }

        setDateFields(start.toISOString(), end.toISOString());
    }
});

watch([date, start, end], () => {
    if (!date.value || !start.value || !end.value) return;

    const dateObj = new Date(date.value);
    dateObj.setHours(parseInt(start.value.substring(0, 2), 10), parseInt(start.value.substring(3, 5), 10));
    dateStart.value = dateObj.toISOString();

    dateObj.setHours(parseInt(end.value.substring(0, 2), 10), parseInt(end.value.substring(3, 5), 10));
    dateEnd.value = dateObj.toISOString();
});

onMounted(() => {
    getSubjects();
});

const subjectOptions = computed(() => {
    return subjects.value.map((subject): Option => ({ label: subject.name, value: subject.name }));
});

const newEntry = computed(() => !timeEntry.value);

async function submitTimeEntry() {
    // TODO: validate data
    // description, start, end: required
    // start, end: date
    // start < end (at least 15 minutes)
    // subject: nullable

    const entry: TimeEntry = {
        id: timeEntry.value ? timeEntry.value.id : "",
        description: description.value,
        start: dateStart.value,
        end: dateEnd.value,
        subject: getSubject(subject.value),
    };

    if (newEntry.value) {
        emit("create", entry);
    } else {
        emit("update", entry);
    }
}
</script>

<template>
    <Modal
        :title="newEntry ? 'Neuer Zeiteintrag' : 'Zeiteintrag bearbeiten'"
        :submit-title="newEntry ? 'Erstellen' : 'Aktualisieren'"
        :show="show"
        @close="$emit('close')"
        @submit="submitTimeEntry"
    >
        <FormGroup label="Datum" name="date" :errors="errors">
            <DateField v-model:value="date" name="date" label="Datum" />
        </FormGroup>
        <FormGroup label="Start" name="start" :errors="errors">
            <TimeField v-model:value="start" name="start" label="Startzeit" />
        </FormGroup>
        <FormGroup label="Ende" name="end" :errors="errors">
            <TimeField v-model:value="end" name="end" label="Ende" />
        </FormGroup>
        <FormGroup label="Beschreibung" name="description" :errors="errors">
            <InputField v-model:value="description" name="description" label="Beschreibung" />
        </FormGroup>
        <FormGroup label="Fach" name="subject" :errors="errors">
            <SelectField
                v-model:value="subject"
                :options="subjectOptions"
                name="subject"
                label="Fach auswählen"
                clearable
            />
        </FormGroup>
    </Modal>
</template>
