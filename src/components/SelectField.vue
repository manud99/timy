<script setup lang="ts">
const { value, name, label, options } = defineProps<{
    value: string;
    name: string;
    label: string;
    options: Option[];
}>();

interface Option {
    label: string;
    value: any;
}

const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();
</script>

<template>
    <select
        class="block w-full mt-1 text-sm rounded border-gray-400 focus:outline-none focus:ring-2 ring-blue-700"
        :name="name"
        :id="`input-${name}`"
        :value="value"
        @change="emit('update:value', $event.target.value)"
    >
        <option disabled value="" v-text="label"></option>
        <option v-for="option in options" :value="option.value" v-text="option.label" />
    </select>
</template>
