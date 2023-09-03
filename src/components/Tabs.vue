<script setup lang="ts">
export interface Tab {
    id: string;
    label: string;
}

const { modelValue, tabs } = defineProps<{ modelValue: string; tabs: Tab[] }>();

const emit = defineEmits<{
    (e: "update:modelValue", id: string): void;
}>();

function changeTab(id: string) {
    emit("update:modelValue", id);
}
</script>

<template>
    <nav class="grid grid-cols-2 text-gray-600">
        <button
            v-for="tab in tabs"
            :class="[
                'py-2 md:py-3 font-semibold rounded-t-lg',
                'border-4 border-b hover:border-b-transparent',
                'focus:outline-none ring-black ring-inset focus-visible:ring-2',
                modelValue === tab.id
                    ? 'border-4-b border-b border-b-transparent border-t border-x bg-white text-gray-800'
                    : 'border-transparent border-b-gray-200 hover:bg-white hover:border-gray-200 transition-colors duration-300',
            ]"
            @click="changeTab(tab.id)"
            v-text="tab.label"
        />
    </nav>
</template>
