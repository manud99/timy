<script setup lang="ts">
import { ref, toRefs, watch, computed, onMounted } from "vue";
import type { Ref } from "vue";
import { TimeEntry } from "../@types/models";
import Modal from "../components/Modal.vue";
import FormGroup from "../components/FormGroup.vue";
import InputField from "../components/InputField.vue";
import DatePicker from "../components/DatePicker.vue";
import SelectField, { Option } from "../components/SelectField.vue";
import TimeField from "../components/TimeField.vue";
import { getSubject, getSubjects, subjects } from "../utils/subjects";
import { getIsoDate, getTime, isOnSameDay, roundedToQuarterHours } from "../utils/date";
import { timeEntries } from "../utils/timeEntries";
import { firstOpened } from "../utils/firstOpened";
import { validate, RuleType, validationErrors } from "../utils/validation";

const description: Ref<string> = ref("");
const dateStart: Ref<string> = ref("");
const dateEnd: Ref<string> = ref("");
const date: Ref<string> = ref("");
const start: Ref<string> = ref("");
const end: Ref<string> = ref("");
const subject: Ref<string> = ref("");

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
    date.value = getIsoDate(dateStart);
    start.value = getTime(dateStart);
    end.value = getTime(dateEnd);
}

// Update fields with values from timeEntry
watch(show, (val) => {
    if (!val) {
        return;
    }
    if (timeEntry.value) {
        // Set fields of existing time entry
        description.value = timeEntry.value?.description!;
        subject.value = timeEntry.value?.subject?.name || "";
        setDateFields(timeEntry.value?.start as string, timeEntry.value?.end as string);
    } else {
        // Set fields to create a new time entry
        description.value = "";
        subject.value = "";

        let start;
        let nowRounded = roundedToQuarterHours(new Date());
        const todaysEntries = timeEntries.value.filter((entry) => isOnSameDay(entry.start, nowRounded) && new Date(entry.end).valueOf() < nowRounded.valueOf());

        if (todaysEntries.length) {
            start = new Date(todaysEntries[todaysEntries.length - 1].end);
        } else if (firstOpened.value && isOnSameDay(firstOpened.value, nowRounded)) {
            start = roundedToQuarterHours(new Date(firstOpened.value));
        } else {
            const midnight = new Date(nowRounded);
            midnight.setHours(0, 0, 0, 0);
            start = new Date(Math.max(nowRounded.valueOf() - 3_600_000, midnight.valueOf()));
        }

        // Enforce difference of at least 15 minutes
        if (nowRounded.valueOf() - start.valueOf() < 900_000) {
            nowRounded = new Date(start.valueOf() + 900_000);
        }

        setDateFields(start.toISOString(), nowRounded.toISOString());
    }
});

watch([date, start, end], () => {
    if (!date.value || !start.value || !end.value) return;

    const dateObj = new Date(date.value);
    dateObj.setHours(parseInt(start.value.substring(0, 2), 10), parseInt(start.value.substring(3, 5), 10));
    dateStart.value = dateObj.toISOString();

    if (end.value === "00:00") {
        dateObj.setHours(24, 0, 0, 0);
    } else {
        dateObj.setHours(parseInt(end.value.substring(0, 2), 10), parseInt(end.value.substring(3, 5), 10));
    }
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
    const entry: TimeEntry = {
        id: timeEntry.value ? timeEntry.value.id : "",
        description: description.value,
        start: dateStart.value,
        end: dateEnd.value,
        subject: subject.value ? getSubject(subject.value) : null,
    };

    if (
        !validate(entry, [
            { field: "description", type: RuleType.Required },
            { field: "start", type: RuleType.Required },
            { field: "end", type: RuleType.Required },
            { field: "start", type: RuleType.Date },
            { field: "end", type: RuleType.Date },
            {
                field: "end",
                type: RuleType.Custom,
                callback: (record) => new Date(record.end).valueOf() - new Date(record.start).valueOf() >= 900_000,
            },
        ])
    )
        return;

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
        <FormGroup label="Datum" name="date" :errors="validationErrors">
            <DatePicker v-model:value="date" name="date" label="Datum" />
        </FormGroup>
        <FormGroup label="Start" name="start" :errors="validationErrors">
            <TimeField v-model:value="start" name="start" label="Startzeit" :end="false" />
        </FormGroup>
        <FormGroup label="Ende" name="end" :errors="validationErrors">
            <TimeField v-model:value="end" name="end" label="Ende" :end="true" />
        </FormGroup>
        <FormGroup label="Beschreibung" name="description" :errors="validationErrors">
            <InputField v-model:value="description" name="description" label="Beschreibung" autofocus />
        </FormGroup>
        <FormGroup label="Fach" name="subject" :errors="validationErrors">
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
