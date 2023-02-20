<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import type { Ref } from "vue";
import Axios, { AxiosError } from "axios";
import type { TimeEntry } from "../../@types/models";
import Modal from "../components/Modal.vue";
import FormGroup from "../components/FormGroup.vue";
import InputField from "../components/InputField.vue";
import { ValidationError } from "../../@types/ValidationErrors";

const description: Ref<string> = ref("");
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
    description.value = timeEntry.value ? timeEntry.value?.description! : "";
    start.value = timeEntry.value ? timeEntry.value?.start!.toISOString() : "";
    end.value = timeEntry.value ? timeEntry.value?.end!.toISOString() : "";
    date.value = timeEntry.value ? timeEntry.value?.start!.toISOString() : "";
    subjectId.value = timeEntry.value ? timeEntry.value?.subjectId!.toString(10) : "";
});

async function submitTimeEntry() {
    const data = {
        description: description.value,
        start: start.value,
        end: end.value,
        subjectId: parseInt(subjectId.value, 10),
    };

    try {
        if (!timeEntry.value) {
            // Create
            //            const response = await Axios.post("/api/subjects", data);
            //            emit("create", data);
        } else {
            // Update
            //            const response = await Axios.put(`/api/subjects/${subject.value?.id!}`, data);
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
            <InputField v-model:value="date" name="date" label="Datum" />
        </FormGroup>
        <FormGroup label="Start" name="start" :errors="errors">
            <InputField v-model:value="start" name="start" label="Startzeit" />
        </FormGroup>
        <FormGroup label="Ende" name="end" :errors="errors">
            <InputField v-model:value="end" name="end" label="Ende" />
        </FormGroup>
        <FormGroup label="Fach" name="subjectId" :errors="errors">
            <InputField v-model:value="subjectId" name="subjectId" label="Fach" />
        </FormGroup>
    </Modal>
</template>
