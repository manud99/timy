<script setup lang="ts">
import { nextTick, onMounted, ref, Ref, watch } from "vue";
import { Subject, TimeEntry } from "../@types/models";
import CustomDate from "../utils/CustomDate";
import Button, { ButtonSize } from "./Button.vue";
import IconGarbage from "../icons/Garbage.vue";
import IconPencil from "../icons/Pencil.vue";
import IconArrowRight from "../icons/ArrowRight.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import Spinner from "./Spinner.vue";
import { activeWeek, timeEntries } from "../utils/timeEntries";

const props = defineProps<{
    loading: boolean;
    timeEntries: TimeEntry[];
    activeWeek: CustomDate;
}>();

const emit = defineEmits<{
    (e: "edit", timeEntry: TimeEntry): void;
    (e: "delete", timeEntry: TimeEntry): void;
    (e: "editSubject", subject: Subject): void;
}>();

function getDateOfDay(day: number): CustomDate {
    return activeWeek.value.addDays(day);
}

function getHoursOfDay(day: number): string {
    const value = getEntriesForDay(day).reduce((prev, cur) => {
        return prev + cur.end.diffInMinutes(cur.start);
    }, 0);
    const hours = Math.floor(value / 60);
    const minutes = value - hours * 60;
    return `${hours}h ${minutes}min`;
}

function getEntriesForDay(day: number): TimeEntry[] {
    const date = getDateOfDay(day);
    return timeEntries.value.filter((entry) => entry.start.isOnSameDay(date));
}

const isOpen: Ref<boolean[]> = ref(Array(7).fill(true));
const heights: Ref<number[]> = ref(Array(7).fill(0));
const list: Ref<HTMLElement | null> = ref(null);
const transitionActive: Ref<boolean> = ref(false);

watch(props, async () => {
    isOpen.value = Array(7).fill(true);
    await nextTick();
    transitionActive.value = !props.loading;
});

function computeHeights() {
    if (!list.value) return;
    const sections = list.value.querySelectorAll(".day-collapse");
    if (!sections || sections.length !== 7) return;

    heights.value = Array.from(sections).map((section) => {
        return Array.from(section.children).reduce((acc, el) => acc + el.getBoundingClientRect().height, 0);
    });
}

onMounted(() => {
    computeHeights();
    window.addEventListener("resize", computeHeights);
});

watch(
    () => timeEntries.value.reduce((acc, cur) => acc + cur.start.valueOf() + cur.end.valueOf(), 0),
    () => nextTick(computeHeights)
);
watch(
    () => props.loading,
    () => nextTick(computeHeights)
);

function collapseDay(event: MouseEvent, day: number) {
    if (event.ctrlKey) {
        // collapse all other days
        const newVal = !isOpen.value[day];
        isOpen.value = isOpen.value.map((_) => newVal);
    } else {
        isOpen.value[day] = !isOpen.value[day];
    }
}
</script>

<template>
    <div class="border-t" v-if="!loading" ref="list">
        <div v-for="day in [...Array(7).keys()]">
            <div
                :class="[
                    'flex flex-wrap justify-between cursor-pointer',
                    'text-xs font-semibold tracking-wide text-left uppercase',
                    'border-b p-2 md:px-4 md:py-3',
                    'bg-gray-50 text-gray-500',
                ]"
                @click="collapseDay($event, day)"
            >
                <div class="flex">
                    <IconArrowRight
                        :class="['mr-2 transition-transform duration-300', isOpen[day] ? 'rotate-90' : '']"
                        :size="16"
                    />
                    <span
                        class="mr-2 bg-amber-300 rounded text-gray-800 px-1.5 py-0.5 -my-0.5"
                        v-if="getDateOfDay(day).isToday()"
                        v-text="'Heute'"
                    />
                    {{ getDateOfDay(day).getFullDate() }}
                </div>
                <div>Total: {{ getHoursOfDay(day) }}</div>
            </div>
            <div
                :class="['day-collapse overflow-hidden', transitionActive ? 'transition-[height] duration-300' : '']"
                :style="{ height: isOpen[day] ? heights[day] + 'px' : 0 }"
            >
                <div v-for="entry in getEntriesForDay(day)">
                    <div class="bg-white border-b px-2 md:px-4 py-2">
                        <div class="grid grid-cols-12 gap-2 items-center justify-between">
                            <div class="col-span-6 md:col-span-3 md:order-2">
                                <SubjectTag
                                    v-if="entry.subject"
                                    class="cursor-pointer"
                                    :subject="entry.subject"
                                    @dblclick="emit('editSubject', entry.subject)"
                                />
                            </div>
                            <div class="col-span-6 md:col-span-2 md:order-4 flex justify-end">
                                <div>
                                    <button
                                        :class="[
                                            'flex items-center font-semibold text-sm border-b-2 p-1 mr-2',
                                            'transition-color duration-300 hover:text-blue-600 hover:border-blue-600',
                                            'focus:text-blue-600 focus:border-blue-600',
                                        ]"
                                        :size="ButtonSize.SM"
                                        label="Bearbeiten"
                                        @click="emit('edit', entry as TimeEntry)"
                                    >
                                        <IconPencil :size="16" />
                                        <span class="hidden sm:inline ml-2">Bearbeiten</span>
                                    </button>
                                </div>
                                <div>
                                    <button
                                        :class="[
                                            'flex items-center font-semibold text-sm border-b-2 p-1',
                                            'transition-color duration-300 hover:text-red-600 hover:border-red-600',
                                            'focus:text-red-600 focus:border-red-600',
                                        ]"
                                        :size="ButtonSize.SM"
                                        label="Löschen"
                                        @click="emit('delete', entry as TimeEntry)"
                                    >
                                        <IconGarbage class="py-[2px]" :size="16" />
                                        <span class="hidden sm:inline ml-2">Löschen</span>
                                    </button>
                                </div>
                            </div>
                            <span class="col-span-4 md:col-span-2 md:order-1 whitespace-nowrap">
                                {{ entry.start.getTime() }} &#x2013; {{ entry.end.getTime() }}
                            </span>
                            <span
                                class="col-span-8 md:col-span-5 xl:col-span-5 md:order-3 font-semibold"
                                v-text="entry.description"
                            />
                        </div>
                    </div>
                </div>
                <div v-if="!getEntriesForDay(day).length" class="bg-white px-4 py-2">Keine Einträge für diesen Tag</div>
            </div>
        </div>
    </div>
    <div v-else class="bg-white border-t text-center px-4 py-8" colspan="9999">
        <Spinner />
    </div>
</template>
