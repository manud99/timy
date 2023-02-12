<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import type { Ref } from "vue";
import Axios from "axios";
import type { Subject } from "../../@types/models";
import Modal from "../components/Modal.vue";
import FormGroup from "../components/FormGroup.vue";
import InputField from "../components/InputField.vue";

const name: Ref<string> = ref("");
const color: Ref<number> = ref(0);

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
    if (subject.value) {
        name.value = subject.value?.name!;
        color.value = subject.value?.color!;
    } else {
        name.value = "";
        color.value = 0;
    }
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
        console.error(err);
    }
}
</script>

<template>
    <Modal title="Fach bearbeiten" :show="show" @close="$emit('close')" @submit="submitSubject">
        <FormGroup label="Name" name="name">
            <InputField v-model:value="name" name="name" />
        </FormGroup>
        <FormGroup label="Farbe" name="color">
            <InputField v-model:value="color" name="color" />
        </FormGroup>
    </Modal>
</template>
