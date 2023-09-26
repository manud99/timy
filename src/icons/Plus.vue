<script setup lang="ts">
const { size } = defineProps<{ size: number }>();
// Source: https://iconmonstr.com/plus-2-svg/
</script>

<template>
    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24">
        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
    </svg>
</template>
