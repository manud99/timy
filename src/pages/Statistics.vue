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
import debounce from "lodash.debounce";
import { getQueryParam, updateQueryParam } from "../utils/queryParams";
import { getSubjects } from "../utils/subjects";
import { getSubjectColor } from "../utils/subjects";
import CustomDate from "../utils/CustomDate";

const startParam = new CustomDate(getQueryParam("start") || "");
const todayMinusSixMonth = CustomDate.now().addMonths(-6);
const startDate = startParam.isValidDate() ? startParam : todayMinusSixMonth;
const endParam = new CustomDate(getQueryParam("end") || "");
const endDate = endParam.isValidDate() ? endParam : CustomDate.now();

const start: Ref<CustomDate> = ref(startDate);
const end: Ref<CustomDate> = ref(endDate);

const timeEntries: Ref<TimeEntry[]> = ref([]);
const minutesPerWeek: Ref<{ [startOfWeek: string]: { total: number; [subject: string]: number } }> = ref({});
const debounceGetTimeEntries = debounce(getTimeEntries, 300);

const startProp = computed({
    get() {
        return start.value.getIsoDate();
    },
    set(value) {
        start.value = new CustomDate(value);
    },
});

const endProp = computed({
    get() {
        return end.value.getIsoDate();
    },
    set(value) {
        end.value = new CustomDate(value);
    },
});

function analyzeTimeEntries() {
    const hours: { [startOfWeek: string]: { total: number; [subject: string]: number } } = {};

    for (let date = start.value.setToWeekStart(); end.value.isBiggerThan(date); date = date.addDays(7)) {
        hours[date.toString()] = { total: 0 };
    }

    timeEntries.value.forEach((entry) => {
        const weekStart = entry.start.setToWeekStart().toString();
        const duration = entry.end.diffInMinutes(entry.start);

        if (entry.subject?.name) {
            hours[weekStart][entry.subject.name] = (hours[weekStart][entry.subject.name] || 0) + duration;
        }
        hours[weekStart].total += duration;
    });

    minutesPerWeek.value = hours;
}

async function getTimeEntries() {
    if (!makeSureCalendarIdExists() || !ready || !ready.value) return;

    timeEntries.value = await fetchEvents(calendarId.value!, start.value, end.value);
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
    updateQueryParam("start", start.value.toString());
    updateQueryParam("end", end.value.toString());
    debounceGetTimeEntries();
});

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, PointElement, Title, Tooltip);

const chartHoursPerWeek = computed(() => {
    const labels = Object.keys(minutesPerWeek.value);

    const subjects = getSubjects().value.filter((subject) => subject.isActive);
    const subjectDatasets = subjects.map((subject) => {
        const color = getSubjectColor(subject);
        const data = labels.map((label) => {
            return (minutesPerWeek.value[label][subject.name] || 0) / 60;
        });
        return { label: subject.name, data, borderColor: color.borderColor, backgroundColor: color.backgroundColor };
    });

    return {
        labels: labels.map((label) => new CustomDate(label).getDate()),
        datasets: subjectDatasets,
    };
});

const totalMinutes = computed(() => {
    const total = Object.values(minutesPerWeek.value).reduce((carry, week) => {
        return carry + week.total;
    }, 0)
    
    const subjects: { [subject: string]: number } = {};
    for (const week in minutesPerWeek.value) {
        for (const subject in minutesPerWeek.value[week]) {
            if (subject === "total") continue;
            subjects[subject] = (subjects[subject] || 0) + minutesPerWeek.value[week][subject];
        }
    }

    return {subjects, total};
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
                    <input type="date" v-model="startProp" :max="end.toString()" />
                    bis
                    <input type="date" v-model="endProp" :min="start.toString()" />
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
        <Section class="bg-white">
            <h2 class="text-xl font-bold p-4">Tabelle Übersicht</h2>
            <table class="table-auto border-t w-full" v-if="minutesPerWeek">
                <thead class="bg-gray-50 text-gray-500 text-xs font-semibold tracking-wide uppercase">
                    <tr class="divide-x">
                        <th class="px-4 py-3 text-left">Woche</th>
                        <th v-for="subject, index in getSubjects().value" :key="index" class="px-4 py-3 text-right">
                            {{ subject.name }}
                        </th>
                        <th class="px-4 py-3 text-right">Total</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <tr v-for="week in Object.keys(minutesPerWeek).reverse()" :key="week" class="divide-x">
                        <td class="px-4 py-1.5">{{ new CustomDate(week).getDate() }}</td>
                        <td v-for="subject, index in getSubjects().value" :key="index" class="px-4 py-1.5 text-right">
                            <span v-if="(minutesPerWeek[week][subject.name] || 0) == 0">-</span>
                            <span v-else v-text="toHoursAndMin((minutesPerWeek[week][subject.name] || 0) / 60)"/>
                        </td>
                        <td class="px-4 py-1.5 text-right">{{ toHoursAndMin(minutesPerWeek[week].total / 60) }}</td>
                    </tr>
                    <tr class="!border-t-2 border-gray-500 divide-x font-bold">
                        <td class="px-4 py-1.5">Insgesamt</td>
                        <td v-for="total in totalMinutes.subjects" class="px-4 py-1.5 text-right">
                            <span v-if="total == 0">-</span>
                            <span v-else v-text="toHoursAndMin(total / 60)"/>
                        </td>
                        <td class="px-4 py-1.5 text-right">{{ toHoursAndMin(totalMinutes.total / 60) }}</td>
                    </tr>
                    <tr class="divide-x font-bold">
                        <td class="px-4 py-1.5">ECTS (25h pro Punkt)</td>
                        <td v-for="total in totalMinutes.subjects" class="px-4 py-1.5 text-right">
                            <span v-if="total == 0">-</span>
                            <span v-else v-text="Math.round(total / 60 / 25 * 100) / 100"/>
                        </td>
                        <td class="px-4 py-1.5 text-right"/>
                    </tr>
                </tbody>
            </table>            
        </Section>
    </Page>
</template>
