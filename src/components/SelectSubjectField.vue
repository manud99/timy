<script lang="ts" setup>
import { computed, onMounted } from "vue";
import SelectField, { Option } from "./SelectField.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import { getSubjects, subjects } from "../utils/subjects";
import { Subject } from "../@types/models";

const props = defineProps<{
    value: string;
    name: string;
    label: string;
}>();

const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

onMounted(() => {
    getSubjects();
});

const subjectOptions = computed(() => {
    return subjects.value.map((subject): Option => ({ label: subject.name, value: subject.name }));
});

const activeSubjects = computed(() => {
    return subjects.value.filter((subject) => subject.isActive);
});

function selectSubject(subject: Subject) {
    emit("update:value", subject.name);
}
</script>

<template>
    <div class="flex flex-wrap gap-4 mb-2">
        <SubjectTag
            v-for="subject in activeSubjects"
            class="cursor-pointer"
            :subject="subject"
            @click="selectSubject(subject)"
        />
    </div>
    <SelectField
        :value="value"
        @update:value="emit('update:value', $event)"
        :options="subjectOptions"
        name="subject"
        label="Fach auswählen"
        clearable
    />
</template>
