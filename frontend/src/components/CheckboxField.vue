<script setup lang="ts">
const { value, name, label } = defineProps<{
    value: boolean;
    name: string;
    label: string;
}>();

const emit = defineEmits<{
    (e: "update:value", value: boolean): void;
}>();

function onInputUpdate(event: Event) {
    emit("update:value", (event.target as HTMLInputElement).checked);
}
</script>

<template>
    <input
        class="w-5 h-5 rounded border-gray-400 focus:outline-none focus:ring-2 ring-blue-700"
        :id="`input-${name}`"
        type="checkbox"
        :placeholder="label"
        :checked="value"
        @input="onInputUpdate"
    />
</template>
