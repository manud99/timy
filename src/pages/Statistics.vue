<script setup lang="ts">
import { Ref, ref, onMounted, computed, watch } from "vue";
import { Bar, Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    ChartOptions,
    TooltipItem,
    PointElement,
} from "chart.js";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import { calendarId, makeSureCalendarIdExists } from "../utils/timeEntries";
import { getCalendarId } from "../utils/settings";
import { ready } from "../google/plugin";
import { TimeEntry } from "../@types/models";
import { fetchEvents } from "../google/query";
import { getDate, getIsoDate, getWeekStart, isValidDate } from "../utils/date";
import debounce from "lodash.debounce";
import { getQueryParam, updateQueryParam } from "../utils/queryParams";
import { getSubjects } from "../utils/subjects";
import { getSubjectColor } from "../utils/subjects";

const startParam = getQueryParam("start") || "";
const todayMinusSixMonth = new Date();
todayMinusSixMonth.setMonth(todayMinusSixMonth.getMonth() - 6);
const startDate = isValidDate(startParam) ? new Date(startParam) : todayMinusSixMonth;
const endParam = getQueryParam("end") || "";
const endDate = isValidDate(endParam) ? new Date(endParam) : new Date();

const start: Ref<string> = ref(getIsoDate(startDate));
const end: Ref<string> = ref(getIsoDate(endDate));

const timeEntries: Ref<TimeEntry[]> = ref([]);
const minutesPerWeek: Ref<{ [startOfWeek: string]: { total: number; [subject: string]: number } }> = ref({});
const debounceGetTimeEntries = debounce(getTimeEntries, 300);

function analyzeTimeEntries() {
    const hours: { [startOfWeek: string]: { total: number; [subject: string]: number } } = {};

    for (
        let date = getWeekStart(start.value);
        new Date(date).valueOf() < new Date(end.value).valueOf();
        date.setDate(date.getDate() + 7)
    ) {
        if (date.getDay() === 1) {
            hours[date.toISOString()] = { total: 0 };
        }
    }

    timeEntries.value.forEach((entry) => {
        const end = new Date(entry.end);
        const start = new Date(entry.start);
        const weekStart = getWeekStart(start).toISOString();
        const duration = Math.floor((end.valueOf() - start.valueOf()) / 60_000);

        if (entry.subject?.name) {
            hours[weekStart][entry.subject.name] = (hours[weekStart][entry.subject.name] || 0) + duration;
        }
        hours[weekStart].total += duration;
    });

    minutesPerWeek.value = hours;
}

async function getTimeEntries() {
    if (!makeSureCalendarIdExists() || !ready || !ready.value) return;

    timeEntries.value = await fetchEvents(
        calendarId.value!,
        new Date(start.value).toISOString(),
        new Date(end.value).toISOString()
    );
    analyzeTimeEntries();
}

onMounted(() => {
    calendarId.value = getCalendarId();
    debounceGetTimeEntries();
});

if (ready) {
    watch(ready, () => {
        debounceGetTimeEntries();
    });
}

watch([start, end], () => {
    updateQueryParam("start", start.value);
    updateQueryParam("end", end.value);
    debounceGetTimeEntries();
});

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip);

const chartHoursPerWeek = computed(() => {
    const labels = Object.keys(minutesPerWeek.value);
    const totalData = labels.map((label) => {
        return minutesPerWeek.value[label].total / 60;
    });

    const subjects = getSubjects().value.filter((subject) => subject.isActive);
    const subjectDatasets = subjects.map((subject) => {
        const color = getSubjectColor(subject);
        const data = labels.map((label) => {
            return (minutesPerWeek.value[label][subject.name] || 0) / 60;
        });
        return { label: subject.name, data, borderColor: color.borderColor, backgroundColor: color.backgroundColor };
    });

    return {
        labels: labels.map((label) => getDate(label)),
        datasets: subjectDatasets,
    };
});

function toHoursAndMin(value: number) {
    const hours = Math.floor(value);
    const minutes = (value - hours) * 60;
    return `${hours}h ${minutes}min`;
}

function label(item: TooltipItem<"bar" | "line">): string {
    return `${item.dataset.label}: ${toHoursAndMin(item.parsed.y)}`;
}

function footer(items: TooltipItem<"bar" | "line">[]) {
    const sum = items.reduce((carry, tooltipItem) => {
        return carry + tooltipItem.parsed.y;
    }, 0);
    return `Total: ${toHoursAndMin(sum)}`;
}

const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
        x: { stacked: true },
        y: { stacked: true },
    },
    interaction: {
        mode: "index",
    },
    plugins: {
        tooltip: {
            callbacks: {
                label,
                footer,
            },
        },
    },
};

const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    interaction: {
        mode: "index",
    },
    plugins: {
        tooltip: {
            callbacks: {
                label,
                footer,
            },
        },
    },
};
</script>

<template>
    <Page title="Statistik">
        <Section class="bg-white p-4">
            <div class="flex flex-wrap gap-4 justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Stunden pro Woche</h2>
                <div>
                    Zeitspanne von
                    <input type="date" v-model="start" :max="end" />
                    bis
                    <input type="date" v-model="end" :min="start" />
                </div>
            </div>
            <div>
                <Bar :data="chartHoursPerWeek" :options="barChartOptions" />
            </div>
        </Section>
        <Section class="bg-white p-4">
            <h2 class="text-xl font-bold mb-4">Line-Chart</h2>
            <Line :data="chartHoursPerWeek" :options="lineChartOptions" />
        </Section>
    </Page>
</template>
