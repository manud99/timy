<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import type { Ref } from "vue";
import type { Subject } from "../@types/models";
import Modal from "../components/Modal.vue";
import FormGroup from "../components/FormGroup.vue";
import InputField from "../components/InputField.vue";
import SelectField from "../components/SelectField.vue";
import CheckboxField from "../components/CheckboxField.vue";
import { ValidationError } from "../@types/ValidationErrors";

const name: Ref<string> = ref("");
const color: Ref<string> = ref("");
const isActive: Ref<boolean> = ref(false);
const errors: Ref<ValidationError[]> = ref([]);

const colorOptions = [
    { value: 1, label: "Gelb" },
    { value: 2, label: "Orange" },
    { value: 3, label: "Pink" },
    { value: 4, label: "Violett" },
    { value: 5, label: "Türkis" },
    { value: 6, label: "Hellblau" },
    { value: 7, label: "Dunkelgrün" },
    { value: 8, label: "Hellgrün" },
];

const props = defineProps<{
    show: boolean;
    subject: Subject | null;
}>();
const { show, subject } = toRefs(props);

const emit = defineEmits<{
    (e: "close"): void;
    (e: "update", subject: Subject): void;
}>();

watch(show, async (val) => {
    if (!val) return;
    name.value = subject.value ? subject.value?.name! : "";
    color.value = subject.value ? subject.value?.color!.toString(10) : "";
    isActive.value = subject.value ? subject.value?.isActive! : false;
});

function submitSubject() {
    const subject: Subject = { name: name.value, color: parseInt(color.value, 10), isActive: isActive.value };
    emit("update", subject);
}
</script>

<template>
    <Modal title="Fach bearbeiten" :show="show" @close="$emit('close')" @submit="submitSubject">
        <FormGroup label="Name" name="name" :errors="errors">
            <InputField v-model:value="name" name="name" label="Name" />
        </FormGroup>
        <FormGroup label="Farbe" name="color" :errors="errors">
            <SelectField v-model:value="color" :options="colorOptions" name="color" label="Farbe auswählen" />
        </FormGroup>
        <FormGroup label="Aktiv?" name="isActive" :errors="errors">
            <CheckboxField v-model:value="isActive" name="isActive" label="aktiv?" />
        </FormGroup>
    </Modal>
</template>
