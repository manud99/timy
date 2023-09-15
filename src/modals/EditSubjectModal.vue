<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";
import type { Ref } from "vue";
import type { Subject } from "../@types/models";
import Modal from "../components/Modal.vue";
import FormGroup from "../components/FormGroup.vue";
import InputField from "../components/InputField.vue";
import SelectField from "../components/SelectField.vue";
import CheckboxField from "../components/CheckboxField.vue";
import { validationErrors, validate, RuleType } from "../utils/validation";

const name: Ref<string> = ref("");
const color: Ref<string> = ref("");
const isActive: Ref<boolean> = ref(false);

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
    name.value = subject.value ? subject.value.name : "";
    color.value = subject.value && subject.value.color ? subject.value.color.toString(10) : "";
    isActive.value = subject.value ? subject.value?.isActive! : false;
});

function submitSubject() {
    const subject: Subject = { name: name.value, color: parseInt(color.value, 10), isActive: isActive.value };

    if (
        !validate(subject, [
            { field: "name", type: RuleType.Required },
            { field: "color", type: RuleType.Required },
            { field: "color", type: RuleType.Custom, callback: (record) => record.color >= 1 && record.color <= 8 },
        ])
    )
        return;

    emit("update", subject);
}

const newEntry = computed(() => !subject.value);
</script>

<template>
    <Modal
        :title="newEntry ? 'Neues Fach' : 'Fach bearbeiten'"
        :submit-title="newEntry ? 'Erstellen' : 'Aktualisieren'"
        :show="show"
        @close="$emit('close')"
        @submit="submitSubject"
    >
        <FormGroup label="Name" name="name" :errors="validationErrors">
            <InputField v-model:value="name" name="name" label="Name" autofocus />
        </FormGroup>
        <FormGroup label="Farbe" name="color" :errors="validationErrors">
            <SelectField v-model:value="color" :options="colorOptions" name="color" label="Farbe auswählen" />
        </FormGroup>
        <FormGroup label="Aktiv?" name="isActive" :errors="validationErrors">
            <CheckboxField v-model:value="isActive" name="isActive" label="aktiv?" />
        </FormGroup>
    </Modal>
</template>
