<script setup lang="ts">
import { ref, toRefs, watch, computed } from "vue";
import type { Ref } from "vue";
import Axios, { AxiosError } from "axios";
import type { TimeEntry } from "../../types/TimeEntry";
import { ValidationError } from "../../types/ValidationErrors";
import Modal from "../components/Modal.vue";
import FormGroup from "../components/FormGroup.vue";
import InputField from "../components/InputField.vue";
import DateField from "../components/DateField.vue";
import TimeField from "../components/TimeField.vue";
import ArrowUp from "../icons/ArrowUp.vue";
import ArrowDown from "../icons/ArrowDown.vue";

const description: Ref<string> = ref("");
const dateStart: Ref<string> = ref("");
const dateEnd: Ref<string> = ref("");
const date: Ref<string> = ref("");
const start: Ref<string> = ref("");
const end: Ref<string> = ref("");
const subjectId: Ref<string> = ref("");
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

watch(show, async (val) => {
    if (!val) return;
    if (timeEntry.value) {
        description.value = timeEntry.value?.description!;
        subjectId.value = timeEntry.value?.subjectId!.toString(10);
        setDateFields(timeEntry.value?.start! as string, timeEntry.value?.end! as string);
    } else {
        description.value = "";
        subjectId.value = "";
        date.value = "";
        start.value = "";
        end.value = "";
    }
});

function setDateFields(dateStart: string, dateEnd: string) {
    // date is in ISO format
    // e.g. 2023-02-13T09:15:00.000Z
    date.value = dateStart.substring(0, 10);
    start.value = dateStart.substring(11, 16);
    end.value = dateEnd.substring(11, 16);
}

watch([date, start, end], () => {
    if (!date.value || !start.value || !end.value) return;

    const value = new Date(date.value);
    value.setHours(parseInt(start.value.substring(0, 2), 10), parseInt(start.value.substring(3, 5), 10));
    dateStart.value = value.toISOString();

    value.setHours(parseInt(end.value.substring(0, 2), 10), parseInt(end.value.substring(3, 5), 10));
    dateEnd.value = value.toISOString();
});

async function submitTimeEntry() {
    const data = {
        description: description.value,
        start: dateStart.value,
        end: dateEnd.value,
        subjectId: parseInt(subjectId.value, 10),
    };

    try {
        if (!timeEntry.value) {
            // Create
            //            const response = await Axios.post("/api/time-entries", data);
            //            emit("create", data);
        } else {
            // Update
            //            const response = await Axios.put(`/api/time-entries/${timeEntry.value?.id!}`, data);
            //            emit("update", { id: timeEntry.value.id, ...data });
        }
    } catch (err) {
        const error = err as AxiosError<{ errors: ValidationError[] }>;
        if (error.response?.status !== 422) {
            console.error(error);
            return;
        }
        errors.value = error.response?.data.errors;
    }
}
</script>

<template>
    <Modal title="Zeiteintrag bearbeiten" :show="show" @close="$emit('close')" @submit="submitTimeEntry">
        <FormGroup label="Beschreibung" name="description" :errors="errors">
            <InputField v-model:value="description" name="description" label="Beschreibung" />
        </FormGroup>
        <FormGroup label="Datum" name="date" :errors="errors">
            <DateField v-model:value="date" name="date" label="Datum" />
        </FormGroup>
        <FormGroup label="Start" name="start" :errors="errors">
            <TimeField v-model:value="start" name="start" label="Startzeit" />
        </FormGroup>
        <FormGroup label="Ende" name="end" :errors="errors">
            <TimeField v-model:value="end" name="end" label="Ende" />
        </FormGroup>
        <FormGroup label="Fach" name="subjectId" :errors="errors">
            <InputField v-model:value="subjectId" name="subjectId" label="Fach" />
        </FormGroup>
    </Modal>
</template>
