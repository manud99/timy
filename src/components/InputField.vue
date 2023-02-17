<script setup lang="ts">
const { value, name, label } = defineProps<{
    value: string;
    name: string;
    label: string;
}>();

const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

function onInputUpdate(event: Event) {
    emit("update:value", (event.target as HTMLInputElement).value);
}
</script>

<template>
    <input
        class="block w-full mt-1 text-sm rounded border-gray-400 focus:outline-none focus:ring-2 ring-blue-700"
        :id="`input-${name}`"
        type="text"
        :placeholder="label"
        :value="value"
        @input="onInputUpdate"
    />
</template>
