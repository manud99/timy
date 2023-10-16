<script setup lang="ts">
import IconCross from "../icons/Cross.vue";

const props = withDefaults(
    defineProps<{
        value: string;
        name: string;
        label: string;
        options: Option[];
        clearable?: boolean;
    }>(),
    { clearable: false }
);

export interface Option {
    label: string;
    value: any;
}

const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

function onInputUpdate(event: Event) {
    emit("update:value", (event.target as HTMLInputElement).value);
}
</script>

<template>
    <div class="flex">
        <select
            :class="[
                'block w-full text-sm border-gray-400 focus:outline-none focus:ring-2 ring-blue-700',
                clearable ? 'rounded-l-lg' : 'rounded-lg',
            ]"
            :name="name"
            :id="`input-${name}`"
            :value="value"
            @change="onInputUpdate"
        >
            <option disabled value="" v-text="label"></option>
            <option v-for="option in options" :value="option.value" v-text="option.label" />
        </select>
        <button
            v-if="clearable"
            :class="[
                'block px-1 text-gray-600',
                'border border-l-0 border-gray-400 rounded-r-lg',
                'focus:outline-none focus:ring-2 ring-blue-700',
            ]"
            title="Auswahl löschen"
            type="button"
            @click="emit('update:value', '')"
        >
            <IconCross :size="16" />
        </button>
    </div>
</template>
