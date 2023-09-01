<script setup lang="ts">
import { Ref, ref, onMounted, computed } from "vue";
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import { calendarId, makeSureCalendarIdExists } from "../utils/timeEntries";
import { getCalendarId } from "../utils/settings";
import { ready } from "../google/plugin";
import { TimeEntry } from "../@types/models";
import { fetchEvents } from "../google/query";
import { getDate, getWeekStart } from "../utils/date";

const timeEntries: Ref<TimeEntry[]> = ref([]);
const start = new Date();
const end = new Date();
start.setMonth(start.getMonth() - 6);
const minutesPerWeek: Ref<{ [startOfWeek: string]: number }> = ref({});

function analyzeTimeEntries() {
    const hours: { [startOfWeek: string]: number } = {};

    for (let date = getWeekStart(start); date.valueOf() < end.valueOf(); date.setDate(date.getDate() + 7)) {
        if (date.getDay() === 1) {
            hours[date.toISOString()] = 0;
        }
    }

    timeEntries.value.forEach((entry) => {
        const end = new Date(entry.end);
        const start = new Date(entry.start);
        console.log(start, getWeekStart(start));
        hours[getWeekStart(start).toISOString()] += Math.floor((end.valueOf() - start.valueOf()) / 60_000);
    });

    minutesPerWeek.value = hours;
}

async function getTimeEntries() {
    if (!makeSureCalendarIdExists() || !ready || !ready.value) return;

    timeEntries.value = await fetchEvents(calendarId.value!, start.toISOString(), end.toISOString());
    analyzeTimeEntries();
}

onMounted(() => {
    calendarId.value = getCalendarId();
    getTimeEntries();
});

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const chartHoursPerWeek = computed(() => {
    const labels = Object.keys(minutesPerWeek.value);
    const data = labels.map((label) => {
        return minutesPerWeek.value[label] / 60;
    });

    return {
        labels: labels.map((label) => getDate(label)),
        datasets: [{ data }],
    };
});
</script>

<template>
    <Page title="Statistik">
        <Section class="bg-white p-4">
            <h2 class="text-xl font-bold mb-4">Stunden pro Woche</h2>
            <Bar :data="chartHoursPerWeek" />
        </Section>
        <Section class="bg-white p-4">
            <h2 class="text-xl font-bold">Stunden pro Fach</h2>
            <div class=""></div>
        </Section>
    </Page>
</template>
