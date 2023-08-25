<script setup lang="ts">
import { ComputedRef, StyleValue, computed, watch } from "vue";
import { getWeekday, isOnSameDay } from "../utils/date";
import { getSubjectColor } from "../subjects";
import { TimeEntry } from "../@types/models";

const props = defineProps<{
    weekStart: string;
    values: Array<TimeEntry>;
}>();

interface Day {
    date: string;
    weekday: string;
    day: number;
}

// const days: Day[] = []; // ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const hours = [...Array(24).keys()];

const days: ComputedRef<Day[]> = computed(() => {
    const date = new Date(props.weekStart);
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push({
            date: date.toISOString(),
            weekday: getWeekday(date),
            day: date.getDate(),
        });
        date.setDate(date.getDate() + 1);
    }
    return days;
});

function getEntries(day: string) {
    return props.values.filter((entry) => isOnSameDay(entry.start, day));
}

const HEIGHT_PER_HOUR = 40;

function getTop(entry: TimeEntry): number {
    const date = new Date(entry.start);
    return date.getHours() * HEIGHT_PER_HOUR + (date.getMinutes() / 60) * HEIGHT_PER_HOUR;
}

function getHeight(entry: TimeEntry): number {
    const end = new Date(entry.end);
    const start = new Date(entry.start);
    return ((end.valueOf() - start.valueOf()) / 3600000) * HEIGHT_PER_HOUR;
}
</script>

<template>
    <div class="bg-white">
        <div class="flex pr-3.5 text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-y bg-gray-50">
            <div class="w-[26px] border-inherit" />
            <div v-for="day in days" class="flex-1 px-2 py-3">{{ day.weekday }}</div>
        </div>
        <div
            :class="[
                'max-h-[600px] overflow-auto scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent',
                'scrollbar-track:!rounded scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300',
                'dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50 pr-2',
            ]"
        >
            <div class="flex border-gray-400">
                <div class="w-[26px] text-sm border-inherit">
                    <div v-for="hour in [...Array(24).keys()]" class="border-r border-inherit">
                        <div class="leading-4 text-gray-600 border-b border-inherit h-[40px] px-1 text-right">
                            {{ hour }}
                        </div>
                    </div>
                </div>
                <div v-for="day in days" class="flex-1 border-inherit relative">
                    <div v-for="hour in hours" class="border-r border-inherit">
                        <div class="border-b border-gray-100 h-[10px]"></div>
                        <div class="border-b border-gray-100 h-[10px]"></div>
                        <div class="border-b border-gray-100 h-[10px]"></div>
                        <div class="border-b border-inherit h-[10px]"></div>
                    </div>

                    <div
                        v-for="entry in getEntries(day.date)"
                        class="absolute w-full px-1.5"
                        :style="{ top: getTop(entry) + 'px', height: getHeight(entry) + 'px' }"
                    >
                        <div
                            v-if="getHeight(entry) > 40"
                            class="h-full border rounded-lg p-1 overflow-hidden"
                            :style="<StyleValue><unknown>getSubjectColor(entry.subject)"
                        >
                            <span
                                v-if="entry.subject"
                                :class="['text-xs rounded px-1 mr-2', getSubjectColor(entry.subject).contrast]"
                                v-text="entry.subject.name"
                            />
                            <span class="font-semibold" v-text="entry.description" />
                        </div>
                        <div
                            v-else
                            class="h-full border rounded-lg px-1 leading-[1] text-ellipsis overflow-hidden whitespace-nowrap"
                            :style="<StyleValue><unknown>getSubjectColor(entry.subject)"
                        >
                            <span
                                v-if="entry.subject"
                                :class="['text-[9px] rounded px-1 mr-1', getSubjectColor(entry.subject).contrast]"
                                v-text="entry.subject.name"
                            />
                            <span class="text-[10px] font-semibold" v-text="entry.description" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
