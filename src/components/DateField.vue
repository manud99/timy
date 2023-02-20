<script setup lang="ts">
const { label, name, value } = defineProps<{ label: string; name: string; value: string }>();
const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

function updateValue(event: Event) {
    emit("update:value", (event.target as HTMLInputElement).value);
}
</script>

<template>
    <input
        class="block text-sm rounded-lg border-gray-400 focus:outline-none focus:ring-2 ring-blue-700"
        :id="`input-${name}`"
        type="date"
        :value="value"
        placeholder="label"
        @input="updateValue"
    />
</template>
