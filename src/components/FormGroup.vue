<script setup lang="ts">
import { ValidationError } from "../../@types/ValidationErrors";
import { ref, toRefs, watch } from "vue";

const props = defineProps({
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

const { label, name, hint, errors } = toRefs(props);
const errorMessages = ref<string[]>([]);

watch(errors, (array) => {
    errorMessages.value =
        array
            .filter((error: ValidationError) => error.field === name?.value)
            .map((error: ValidationError) => error.message) || [];
});
</script>

<template>
    <div class="grid items-baseline xl:grid-cols-5 gap-4 mb-4">
        <div>
            <label class="" :for="`input-${name}`" v-text="label" />
        </div>
        <div class="xl:col-span-4">
            <slot></slot>
            <div v-if="hint" class="text-sm pt-1 text-gray-600" v-text="hint" />
            <div v-for="error in errorMessages" class="text-sm pt-1 text-red-600" v-text="error" />
        </div>
    </div>
</template>
