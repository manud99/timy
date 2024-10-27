<template>
    <button
        :class="[
            'inline-flex items-center',
            'font-medium leading-5 text-white',
            'border border-transparent rounded-lg',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2',
            getSizeClasses(),
            getColorClasses(),
        ]"
        :aria-label="label"
    >
        <slot>{{ label }}</slot>
    </button>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

export enum ButtonSize {
    SM = "sm",
    MD = "md",
    LG = "lg",
    XL = "xl",
}

export default defineComponent({
    props: {
        label: { type: String, required: true },
        color: { type: String, default: "blue" },
        size: { type: String as PropType<ButtonSize>, default: () => ButtonSize.MD },
        fullWidth: { type: Boolean, default: false },
    },
    methods: {
        getSizeClasses(): string {
            switch (this.size) {
                case ButtonSize.XL:
                    return "px-4 md:px-10 py-4";
                case ButtonSize.LG:
                    return "px-3 md:px-5 py-3";
                case ButtonSize.SM:
                    return "px-2 md:px-3 py-1 text-sm";
                case ButtonSize.MD:
                default:
                    return "px-2 md:px-4 py-2 text-sm";
            }
        },
        getColorClasses(): string {
            switch (this.color) {
                case "yellow":
                    return "bg-yellow-600 active:bg-yellow-600 hover:bg-yellow-700 ring-yellow-700";
                case "red":
                    return "bg-red-600 active:bg-red-600 hover:bg-red-700 ring-red-700";
                case "green":
                    return "bg-green-600 active:bg-green-600 hover:bg-green-700 ring-green-700";
                case "blue":
                default:
                    return "bg-blue-600 active:bg-blue-600 hover:bg-blue-700 ring-blue-700";
            }
        },
    },
});
</script>
