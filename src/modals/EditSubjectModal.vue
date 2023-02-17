<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import type { Ref } from "vue";
import Axios from "axios";
import type { Subject } from "../../@types/models";
import Modal from "../components/Modal.vue";
import FormGroup from "../components/FormGroup.vue";
import InputField from "../components/InputField.vue";
import SelectField from "../components/SelectField.vue";
import { ValidationError } from "../../@types/ValidationErrors";

const name: Ref<string> = ref("");
const color: Ref<string> = ref("");
const errors: Ref<ValidationError[]> = ref([]);

const colorOptions = [
    { value: 1, label: "Gelb" },
    { value: 2, label: "Orange" },
    { value: 3, label: "Pink" },
    { value: 4, label: "Violett" },
    { value: 5, label: "Türkis" },
    { value: 6, label: "Hellgelb" },
    { value: 7, label: "Dunkelgrün" },
    { value: 8, label: "Hellgrün" },
];

const props = defineProps<{
    show: boolean;
    subject: {
        id: number;
        name: string;
        color: number;
    } | null;
}>();
const { show, subject } = toRefs(props);

const emit = defineEmits<{
    (e: "close"): void;
    (e: "create", subject: Subject): void;
    (e: "update", subject: Subject): void;
}>();

watch(show, async (val) => {
    if (!val) return;
    name.value = subject.value ? subject.value?.name! : "";
    color.value = subject.value ? subject.value?.color!.toString(10) : "";
});

async function submitSubject() {
    const data = { name: name.value, color: color.value };

    try {
        if (!subject.value) {
            // Create
            const response = await Axios.post("/api/subjects", data);
            emit("create", response.data.subject);
        } else {
            // Update
            const response = await Axios.put(`/api/subjects/${subject.value?.id!}`, data);
            emit("update", response.data.subject);
        }
    } catch (err) {
        if (err.response.status !== 422) {
            console.error(err);
            return;
        }

        errors.value = err.response.data.errors;
    }
}
</script>

<template>
    <Modal title="Fach bearbeiten" :show="show" @close="$emit('close')" @submit="submitSubject">
        <FormGroup label="Name" name="name" :errors="errors">
            <InputField v-model:value="name" name="name" label="Name" />
        </FormGroup>
        <FormGroup label="Farbe" name="color" hint="Zahl von 1 bis 8" :errors="errors">
            <SelectField v-model:value="color" :options="colorOptions" name="color" label="Farbe auswählen" />
        </FormGroup>
    </Modal>
</template>
