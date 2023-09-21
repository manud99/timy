<script setup lang="ts">
import { computed } from "vue";
import Button, { ButtonSize } from "./Button.vue";
import IconArrowLeft from "../icons/ArrowLeft.vue";
import IconArrowRight from "../icons/ArrowRight.vue";
import CustomDate from "../utils/CustomDate";

const props = defineProps<{ weekStart: CustomDate; weekEnd: CustomDate }>();
const emit = defineEmits<{
    (e: "update", value: number): void;
}>();

const weekNumber = computed(() => {
    return props.weekStart.getWeekNumber();
});
</script>

<template>
    <div class="flex flex-wrap justify-between gap-4 items-center bg-white text-gray-600 font-semibold px-4 py-3">
        <div class="md:order-1 grow text-center">
            Woche {{ weekNumber }} vom {{ weekStart.getDate() }} &#x2013; {{ weekEnd.addDays(-1).getDate() }}
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
