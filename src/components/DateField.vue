<script setup lang="ts">
import { computed, toRefs } from "vue";

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
</script>

<template>
    <div class="grid grid-cols-4">
        <button
            v-for="(day, i) in days"
            class="text-white transition-colors duration-300 ring-blue-600 focus:ring-2"
            :class="[
                numDaysFromToday === day.diff ? 'bg-blue-600' : 'bg-gray-400',
                i === 0 ? 'rounded-l-lg' : '',
                i !== 0 ? '' : '',
            ]"
            @click="setDateFromToday(day.diff)"
            v-text="day.label"
        />
        <input
            class="block text-sm rounded-r-lg border-2 focus:outline-none focus:ring-2"
            :class="[
                numDaysFromToday !== null && (numDaysFromToday > 0 || numDaysFromToday < -2)
                    ? 'border-blue-600'
                    : 'border-gray-400',
            ]"
            :id="`input-${name}`"
            type="date"
            :value="value"
            :aria-label="label"
            @input="updateValue"
        />
    </div>
</template>
