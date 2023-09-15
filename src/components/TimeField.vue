<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ label: string; value: string; name: string; end: boolean }>();
const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

const valueInMinutes = computed(() => {
    const parts = props.value.split(":");
    const value = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    if (value === 0 && props.end) return 1440;
    return value;
});

const minutesUntilMidnight = computed(() => {
    return 1440 - valueInMinutes.value;
});

function updateValue(event: Event) {
    emit("update:value", (event.target as HTMLInputElement).value);
}

function padNumber(num: number, length: number) {
    return num.toString().padStart(2, "0");
}

function addMinutes(amount: number) {
    if (!props.value) return;

    const newValue = valueInMinutes.value + amount;
    let hours = Math.floor(newValue / 60);
    if (hours === 24) hours = 0;
    const minutes = newValue % 60;

    emit("update:value", `${padNumber(hours, 2)}:${padNumber(minutes, 2)}`);
}
</script>

<template>
    <div class="flex border-gray-400">
        <button
            :class="[
                'hidden sm:block flex-1 border-l border-y border-inherit rounded-l-lg',
                'px-2 md:px-4 py-2 text-sm',
                valueInMinutes < 240
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'hover:text-white hover:border-blue-400 hover:bg-blue-400',
            ]"
            type="button"
            :disabled="valueInMinutes < 240"
            @click="addMinutes(-240)"
        >
            -4h
        </button>
        <button
            :class="[
                'flex-1 border-l border-y border-inherit rounded-l-lg sm:rounded-none',
                'px-2 md:px-4 py-2 text-sm',
                valueInMinutes < 60
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'hover:text-white hover:border-blue-400 hover:bg-blue-400',
            ]"
            type="button"
            :disabled="valueInMinutes < 60"
            @click="addMinutes(-60)"
        >
            -1h
        </button>
        <button
            :class="[
                'flex-1 border-l border-y border-inherit',
                'px-2 md:px-4 py-2 text-sm',
                valueInMinutes < 15
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'hover:text-white hover:border-blue-500 hover:bg-blue-500',
            ]"
            type="button"
            :disabled="valueInMinutes < 15"
            @click="addMinutes(-15)"
        >
            -15m<span class="hidden sm:inline">in</span>
        </button>
        <input
            class="block text-sm border border-blue-600 bg-blue-600 text-white focus:outline-none focus:ring-2 focus:z-10 ring-blue-700"
            style="color-scheme: dark"
            :id="`input-${name}`"
            type="time"
            :value="value"
            placeholder="label"
            @input="updateValue"
        />
        <button
            :class="[
                'flex-1 border-r border-y border-inherit',
                'px-2 md:px-4 py-2 text-sm',
                minutesUntilMidnight < 15
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'hover:text-white hover:border-blue-400 hover:bg-blue-400',
            ]"
            type="button"
            :disabled="minutesUntilMidnight < 15"
            @click="addMinutes(15)"
        >
            +15m<span class="hidden sm:inline">in</span>
        </button>
        <button
            :class="[
                'flex-1 border-r border-y border-inherit rounded-r-lg sm:rounded-none',
                'px-2 md:px-4 py-2 text-sm',
                minutesUntilMidnight < 60
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'hover:text-white hover:border-blue-400 hover:bg-blue-400',
            ]"
            type="button"
            :disabled="minutesUntilMidnight < 60"
            @click="addMinutes(60)"
        >
            +1h
        </button>
        <button
            :class="[
                'hidden sm:block flex-1 border-r border-y border-inherit',
                'rounded-r-lg px-2 md:px-4 py-2 text-sm',
                minutesUntilMidnight < 240
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'hover:text-white hover:border-blue-400 hover:bg-blue-400',
            ]"
            type="button"
            :disabled="minutesUntilMidnight < 240"
            @click="addMinutes(240)"
        >
            +4h
        </button>
    </div>
</template>
