<script setup lang="ts">
const props = defineProps<{
    color: number;
    text: string;
    isActive: boolean;
}>();

function getColor() {
    switch (props.color) {
        case 1: // Yellow
            return {
                backgroundColor: "hsl(50deg 92% 56%)",
                color: "rgb(0 0 0 / 76%)",
            };
        case 2: // Red
            return {
                backgroundColor: "hsl(16deg 95% 63%)",
                color: "hsl(0deg 0% 100% / 91%)",
            };
        case 3: // Pink
            return {
                backgroundColor: "hsl(331deg 100% 65%)",
                color: "hsl(330deg 17% 18%)",
            };

        case 4: // Purple
            return {
                backgroundColor: "hsl(280deg 69% 74%)",
                color: "hsl(280deg 30% 13%)",
            };

        case 5: // Turquoise
            return {
                backgroundColor: "hsl(179deg 86% 40%)",
                color: "hsl(179deg 34% 13%)",
            };

        case 6: // Ligthblue
            return {
                backgroundColor: "hsl(196deg 100% 71%)",
                color: "hsl(196deg 34% 13%)",
            };

        case 7: // Darkgreen
            return {
                backgroundColor: "hsl(150deg 100% 27%)",
                color: "hsl(150deg 34% 93%)",
            };

        case 8: // Lightgreen
            return {
                backgroundColor: "hsl(120deg 74% 64%)",
                color: "hsl(120deg 20% 10%)",
            };
        default:
            return {
                backgroundColor: "black",
                color: "white",
            };
    }
}
</script>

<template>
    <div class="inline-flex items-center rounded-lg text-sm py-2 pl-2 pr-4" :style="getColor()">
        <div class="rounded w-2 h-2 mr-2" :class="isActive ? 'bg-white/80' : 'bg-black/80'" />
        <span v-text="text" />
    </div>
</template>
