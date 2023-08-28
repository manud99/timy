<script setup lang="ts">
const props = defineProps<{ label: string; value: string; name: string }>();
const emit = defineEmits<{
    (e: "update:value", value: string): void;
}>();

function updateValue(event: Event) {
    emit("update:value", (event.target as HTMLInputElement).value);
}

function addTime(amount: number) {
    if (!props.value) return;

    const parts = props.value.split(":");
    const total = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) + amount;
    const hours = Math.floor(total / 60)
        .toString()
        .padStart(2, "0");
    const minutes = (total % 60).toString().padStart(2, "0");
    emit("update:value", `${hours}:${minutes}`);
}
</script>

<template>
    <div class="flex border-gray-400">
        <button
            class="flex-1 border-l-2 border-y-2 border-inherit rounded-l-lg px-2 md:px-4 py-2 text-sm hover:text-white hover:border-blue-600 hover:bg-blue-600"
            type="button"
            @click="addTime(-240)"
        >
            -4h
        </button>
        <button
            class="flex-1 border-l-2 border-y-2 border-inherit px-2 md:px-4 py-2 text-sm hover:text-white hover:border-blue-600 hover:bg-blue-600"
            type="button"
            @click="addTime(-60)"
        >
            -1h
        </button>
        <button
            class="flex-1 border-l-2 border-y-2 border-inherit px-2 md:px-4 py-2 text-sm hover:text-white hover:border-blue-600 hover:bg-blue-600"
            type="button"
            @click="addTime(-15)"
        >
            -15min
        </button>
        <input
            class="block text-sm border-2 border-inherit bg-gray-400 text-white focus:outline-none focus:ring-2 focus:z-10 ring-blue-700"
            style="color-scheme: dark"
            :id="`input-${name}`"
            type="time"
            :value="value"
            placeholder="label"
            @input="updateValue"
        />
        <button
            class="flex-1 border-r-2 border-y-2 border-inherit px-2 md:px-4 py-2 text-sm hover:text-white hover:border-blue-600 hover:bg-blue-600"
            type="button"
            @click="addTime(15)"
        >
            +15min
        </button>
        <button
            class="flex-1 border-r-2 border-y-2 border-inherit px-2 md:px-4 py-2 text-sm hover:text-white hover:border-blue-600 hover:bg-blue-600"
            type="button"
            @click="addTime(60)"
        >
            +1h
        </button>
        <button
            class="flex-1 border-r-2 border-y-2 border-inherit rounded-r-lg px-2 md:px-4 py-2 text-sm hover:text-white hover:border-blue-600 hover:bg-blue-600"
            type="button"
            @click="addTime(240)"
        >
            +4h
        </button>
    </div>
</template>
