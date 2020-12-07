<template>
    <div class="flex justify-center align-center" :class="`text-${color}`">
        <svg class="spinner" viewBox="0 0 50 50" :style="{width: size, height: size}">
            <circle class="path stroke-current" cx="25" cy="25" r="20" fill="none" stroke-width="6"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: {
        size: {
            type: Number,
            default: 30,
        },
        color: {
            type: String,
            default: 'indigo-500',
        },
    },
};
</script>
