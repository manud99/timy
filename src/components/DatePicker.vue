<script setup lang="ts">
import { computed, ref, toRefs } from "vue";

const props = defineProps<{ label: string; name: string; value: string | null }>();
const { label, name, value } = toRefs(props);

const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

function updateValue(event: Event) {
    emit("update:value", (event.target as HTMLInputElement).value);
}

const days = [
    { diff: 0, label: "Heute" },
    { diff: -1, label: "Gestern" },
    { diff: -2, label: "Vorgestern" },
];

const numDaysFromToday = computed(() => {
    if (!value.value) return null;

    const today = new Date();
    const then = new Date(value.value);
    today.setHours(0, 0, 0);
    then.setHours(0, 0, 0);

    return ((then.valueOf() - today.valueOf()) / 86400000) | 0; // seconds per day
});

function setDateFromToday(dayDifference: number) {
    const date = new Date();
    date.setDate(date.getDate() + dayDifference);
    emit("update:value", date.toISOString().substring(0, 10));
}

const hasFocus = ref(false);
</script>

<template>
    <div class="grid grid-cols-4 border-gray-400">
        <button
            v-for="(day, i) in days"
            class="py-1.5 border-2 border-r-0 transition-colors duration-300 ring-blue-600 focus:ring-2 focus:z-0"
            :class="[
                numDaysFromToday === day.diff ? 'bg-blue-600 border-blue-600 text-white' : 'border-inherit',
                i === 0 ? 'rounded-l-lg' : '',
            ]"
            type="button"
            @click="setDateFromToday(day.diff)"
            v-text="day.label"
        />
        <div class="relative border-inherit">
            <div
                v-show="!hasFocus && (!numDaysFromToday || (numDaysFromToday <= 0 && numDaysFromToday >= -2))"
                class="pointer-events-none z-0 absolute inset-0 py-1 border-2 border-inherit bg-white text-base text-center rounded-r-lg transition-colors duration-300 ring-blue-600 focus:ring-2 focus:z-0"
                type="button"
                @click="setDateFromToday(-3)"
                v-text="'Früher'"
            />
            <input
                class="block text-sm rounded-r-lg border-2 focus:outline-none focus:ring-2 border-blue-600"
                :id="`input-${name}`"
                type="date"
                :value="value"
                :aria-label="label"
                @input="updateValue"
                @focus="hasFocus = true"
                @blur="hasFocus = false"
            />
        </div>
    </div>
</template>
