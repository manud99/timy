<template>
    <button
        class="inline-flex items-center font-medium leading-5 text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:ring-2"
        :class="[getSizeClasses(), getColorClasses()]"
        :aria-title="label"
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
                    return "px-10 py-4";
                case ButtonSize.LG:
                    return "px-5 py-3";
                case ButtonSize.SM:
                    return "px-3 py-1 text-sm";
                case ButtonSize.MD:
                default:
                    return "px-4 py-2 text-sm";
            }
        },
        getColorClasses(): string {
            switch (this.color) {
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
