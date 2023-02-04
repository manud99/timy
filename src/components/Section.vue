<script setup lang="ts">
defineProps<{title: string}>();
</script>

<template>
    <h2 class="mb-4 text-lg font-semibold text-gray-600" v-text="title"/>
    <div class="w-full mb-8 overflow-hidden rounded-lg shadow-md">
        <slot></slot>
    </div>
</template>