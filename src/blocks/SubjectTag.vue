<script setup lang="ts">
import { StyleValue, computed } from "vue";
import { Subject } from "../@types/models";
import { getSubjectColor } from "../utils/subjects";

const props = defineProps<{
    subject: Subject;
}>();

const color = computed(() => {
    return getSubjectColor(props.subject);
});
</script>

<template>
    <div class="inline-flex items-center rounded-lg text-sm py-2 pl-2 pr-4" :style="<StyleValue><unknown>color">
        <div class="rounded w-2 h-2 mr-2" :class="subject.isActive ? 'bg-white/80' : 'bg-black/80'" />
        <span v-text="subject.name" />
    </div>
</template>
