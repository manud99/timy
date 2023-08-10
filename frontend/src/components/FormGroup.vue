<script setup lang="ts">
import { ValidationError } from "../../types/ValidationErrors";
import { computed } from "vue";

const { label, name, hint, errors } = defineProps({
    label: { type: String, required: true },
    name: { type: String, required: true },
    hint: { type: String, default: "" },
    errors: {
        type: Object,
        default() {
            return [];
        },
    },
});

const errorMessages = computed(() => {
    return (
        errors
            .filter((error: ValidationError) => error.field === name)
            .map((error: ValidationError) => error.message) || []
    );
});
</script>

<template>
    <div class="grid items-baseline lg:grid-cols-5 gap-4 mb-5">
        <div>
            <label
                class="text-xs font-semibold tracking-wide text-gray-500 uppercase"
                :for="`input-${name}`"
                v-text="label"
            />
        </div>
        <div class="lg:col-span-4">
            <slot></slot>
            <div v-if="hint" class="text-sm pt-1 text-gray-600" v-text="hint" />
            <div v-for="error in errorMessages" class="text-sm pt-1 text-red-600" v-text="error" />
        </div>
    </div>
</template>
