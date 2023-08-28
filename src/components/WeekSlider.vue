<script setup lang="ts">
import { computed } from "vue";
import Button, { ButtonSize } from "./Button.vue";
import IconArrowLeft from "../icons/ArrowLeft.vue";
import IconArrowRight from "../icons/ArrowRight.vue";
import { getDate, getWeekNumber, addDay } from "../utils/date";

const props = defineProps<{ activeWeek: string; weekStart: string; weekEnd: string }>();
const emit = defineEmits<{
    (e: "update", value: number): void;
}>();

const weekNumber = computed(() => {
    return getWeekNumber(props.activeWeek);
});
</script>

<template>
    <div class="flex flex-wrap justify-between gap-4 items-center bg-white text-gray-600 font-semibold px-4 py-3">
        <div class="md:order-1 grow text-center">
            Woche {{ weekNumber }} vom {{ getDate(weekStart) }} &#x2013; {{ getDate(addDay(weekEnd, -1)) }}
        </div>
        <div class="md:order-0">
            <Button :size="ButtonSize.MD" label="Woche zurück" @click="emit('update', -7)">
                <IconArrowLeft class="mr-2" :size="12" />
                <span>Woche {{ (weekNumber - 1) % 53 }}</span>
            </Button>
        </div>
        <div class="order-2 md:text-right">
            <Button class="" :size="ButtonSize.MD" label="Woche zurück" @click="emit('update', 7)">
                <span>Woche {{ (weekNumber + 1) % 53 }}</span>
                <IconArrowRight class="ml-2" :size="12" />
            </Button>
        </div>
    </div>
</template>
