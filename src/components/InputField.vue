<script setup lang="ts">
const {value, name} = defineProps<{
    value: string,
    name: string,
}>();

defineEmits<{
    (e: 'update:value', value: string): void
}>();
</script>

<template>
    <input
            class="block w-full mt-1 text-sm rounded focus:border-purple-400 focus:outline-none focus:ring-2 ring-blue-700"
            type="text"
            :value="value"
            @input="$emit('update:value', $event.target.value)"
    >
</template>
