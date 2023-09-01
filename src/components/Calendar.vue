<script setup lang="ts">
import { ComputedRef, Ref, StyleValue, computed, onMounted, onUnmounted, ref, watch } from "vue";
import { getTime, getWeekday, isOnSameDay } from "../utils/date";
import { getSubjectColor } from "../utils/subjects";
import { TimeEntry } from "../@types/models";

const props = defineProps<{
    weekStart: string;
    values: Array<TimeEntry>;
}>();

const emit = defineEmits<{
    (e: "update", timeEntry: TimeEntry): void;
    (e: "delete", timeEntry: TimeEntry): void;
    (e: "edit", timeEntry: TimeEntry): void;
}>();

interface Day {
    date: string;
    weekday: string;
    day: number;
}

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
const hours = [...Array(24).keys()];

function getEntries(day: string) {
    return props.values.filter((entry) => isOnSameDay(entry.start, day));
}

const HEIGHT_PER_HOUR = 40;

function getTop(entry: TimeEntry): number {
    const date = new Date(entry.start);
    return date.getHours() * HEIGHT_PER_HOUR + (date.getMinutes() / 60) * HEIGHT_PER_HOUR;
}

function getDurationInMs(entry: TimeEntry): number {
    const end = new Date(entry.end);
    const start = new Date(entry.start);
    return end.valueOf() - start.valueOf();
}

function getHeight(entry: TimeEntry): number {
    return (getDurationInMs(entry) / 3_600_000) * HEIGHT_PER_HOUR;
}

let hourBoxes: HTMLElement[] | null = [];
const scrollArea = ref<HTMLElement | null>();
const draggedTimeEntry: Ref<TimeEntry | null> = ref(null);
let mouseOffsetX = 0;
let mouseOffsetY = 0;
let clone: HTMLElement | null = null;
let ghost: HTMLElement | null = null;
let dragTarget: HTMLElement | null = null;

function onDragStart(event: DragEvent, timeEntry: TimeEntry) {
    if (!event.target || !scrollArea.value) return;

    dragTarget = <HTMLElement>(<HTMLElement>event.target).childNodes[0];
    const rect = dragTarget.getBoundingClientRect();
    draggedTimeEntry.value = timeEntry;
    mouseOffsetX = event.offsetX;
    mouseOffsetY = event.offsetY;

    clone = <HTMLElement>dragTarget.cloneNode(true);
    clone.id = "calendar-clone";
    clone.classList.add("absolute", "-top-[50px]");
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    scrollArea.value.appendChild(clone);

    ghost = <HTMLElement>dragTarget.cloneNode(true);
    ghost.id = "calendar-ghost";
    ghost.classList.add("absolute", "pointer-events-none", "opacity-50", "ml-1.5");
    ghost.style.width = rect.width + "px";
    ghost.style.height = rect.height + "px";
    ghost.style.left = rect.left + "px";
    ghost.style.top = rect.top + "px";
    scrollArea.value.appendChild(ghost);

    event.dataTransfer?.setDragImage(clone, event.offsetX, event.offsetY);
    dragTarget.style.visibility = "hidden";
}

function findClosestHourBox(x: number, y: number) {
    if (!hourBoxes) return { minx: 0, miny: 0, el: null };

    let el = hourBoxes[0];
    let { left: minx, top: miny } = el.getBoundingClientRect();
    hourBoxes.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (Math.abs(rect.left - x) < Math.abs(minx - x) || Math.abs(rect.top - y) < Math.abs(miny - y)) {
            minx = rect.left;
            miny = rect.top;
            el = element;
        }
    });

    return { minx, miny, el };
}

function onDrag(event: DragEvent) {
    if (!ghost || !hourBoxes) return;

    const x = event.clientX - mouseOffsetX;
    const y = event.clientY - mouseOffsetY;

    const { minx, miny } = findClosestHourBox(x, y);

    ghost.style.left = minx + "px";
    ghost.style.top = miny + "px";
}

function onDragOver(event: DragEvent) {
    event.preventDefault();
}

function getElementIndexInContainer(element: HTMLElement | null): number {
    if (!element || !element.parentElement) return 0;
    return [...Array.from(element.parentElement.childNodes).filter((el) => el.nodeType === 1)].indexOf(element);
}

function onDrop(event: DragEvent) {
    if (!ghost || !clone || !dragTarget || !draggedTimeEntry.value) return;

    event.preventDefault();

    const rect = ghost.getBoundingClientRect();
    const { el: hourBox } = findClosestHourBox(rect.left, rect.top);
    if (!hourBox || !hourBox.parentElement || !hourBox.parentElement) return;

    const indexQuarterHour = getElementIndexInContainer(hourBox);
    const indexHour = getElementIndexInContainer(hourBox.parentElement);
    const indexDay = getElementIndexInContainer(hourBox.parentElement.parentElement) - 1;

    const start = new Date(props.weekStart);
    start.setDate(start.getDate() + indexDay);
    start.setHours(start.getHours() + indexHour);
    start.setMinutes(start.getMinutes() + indexQuarterHour * 15);
    const end = new Date(start.valueOf() + getDurationInMs(draggedTimeEntry.value));
    new Date(draggedTimeEntry.value.end);

    draggedTimeEntry.value.start = start.toISOString();
    draggedTimeEntry.value.end = end.toISOString();
    emit("update", draggedTimeEntry.value);
    draggedTimeEntry.value = null;

    clone.parentElement?.removeChild(clone);
    clone = null;
    ghost.parentElement?.removeChild(ghost);
    ghost = null;

    dragTarget.style.visibility = "";
}

function onDblClick(event: MouseEvent, entry: TimeEntry) {
    emit("edit", entry);
}

onMounted(() => {
    if (scrollArea.value) {
        scrollArea.value.scrollTop = 7 * HEIGHT_PER_HOUR;
        hourBoxes = <HTMLElement[]>[...Array.from(scrollArea.value.querySelectorAll(".hour-box"))];
    }
});
</script>

<template>
    <div class="flex pr-3.5 text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-y bg-gray-50">
        <div class="w-[26px] border-inherit" />
        <div v-for="day in days" class="flex-1 px-2 py-3">{{ day.weekday }}</div>
    </div>
    <div
        :class="[
            'bg-white max-h-[600px] overflow-auto scrollbar:!w-1.5 scrollbar:!h-1.5 scrollbar:bg-transparent',
            'scrollbar-track:!rounded scrollbar-track:!bg-slate-100 scrollbar-thumb:!rounded scrollbar-thumb:!bg-slate-300',
            'dark:scrollbar-track:!bg-slate-500/[0.16] dark:scrollbar-thumb:!bg-slate-500/50 pr-2',
        ]"
        ref="scrollArea"
    >
        <div class="flex border-gray-400">
            <div class="w-[26px] text-sm border-inherit">
                <div
                    v-for="hour in [...Array(24).keys()]"
                    class="h-[40px] border-b border-r border-inherit text-right text-gray-600 leading-4 px-1"
                    v-text="hour"
                />
            </div>
            <div v-for="day in days" class="flex-1 border-inherit relative" @dragover="onDragOver" @drop="onDrop">
                <div v-for="_ in hours" class="border-r border-inherit">
                    <div class="hour-box border-b border-gray-100 h-[10px]" />
                    <div class="hour-box border-b border-gray-100 h-[10px]" />
                    <div class="hour-box border-b border-gray-100 h-[10px]" />
                    <div class="hour-box border-b border-inherit h-[10px]" />
                </div>

                <div
                    v-for="entry in getEntries(day.date)"
                    class="absolute w-full px-1.5"
                    :style="{ top: getTop(entry) + 'px', height: getHeight(entry) + 'px' }"
                >
                    <div
                        class="h-full cursor-pointer"
                        draggable="true"
                        @dragstart="onDragStart($event, entry)"
                        @drag="onDrag"
                        @dblclick="onDblClick($event, entry)"
                    >
                        <div
                            v-if="getHeight(entry) > 40"
                            class="h-full border rounded-lg px-1 py-0.5 overflow-hidden translate-x-0"
                            :style="<StyleValue><unknown>getSubjectColor(entry.subject)"
                        >
                            <span
                                v-if="entry.subject"
                                :class="['text-xs rounded px-1 mr-2', getSubjectColor(entry.subject).contrast]"
                                v-text="entry.subject.name"
                            />
                            <span class="text-sm font-semibold" v-text="entry.description" />
                            <div class="text-xs" v-text="getTime(entry.start) + ' &#x2013; ' + getTime(entry.end)"></div>
                        </div>
                        <div
                            v-else-if="getHeight(entry) > 10"
                            class="h-full flex items-center border rounded-lg px-1 leading-[1] text-[11px] text-ellipsis overflow-hidden whitespace-nowrap"
                            :style="<StyleValue><unknown>getSubjectColor(entry.subject)"
                        >
                            <span
                                v-if="entry.subject"
                                :class="[
                                    'text-[9px] rounded px-1 py-0.5 mr-1',
                                    getSubjectColor(entry.subject).contrast,
                                ]"
                                v-text="entry.subject.name"
                            />
                            <span class="font-semibold" v-text="entry.description" />
                        </div>
                        <div
                            v-else
                            class="h-full border rounded-lg overflow-hidden"
                            :title="entry.subject ? `[${entry.subject.name}] ${entry.description}` : entry.description"
                            :style="<StyleValue><unknown>getSubjectColor(entry.subject)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
