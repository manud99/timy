<script setup lang="ts">
const { size } = defineProps<{ size: number }>();
// Source: https://iconmonstr.com/arrow-63-svg/
</script>

<template>
    <svg :width="size" :height="size" class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
    </svg>
</template>
