<script setup lang="ts">
    const {label, name} = defineProps<{label: string, name: string}>();
</script>

<template>
    <div class="grid items-baseline xl:grid-cols-3 gap-4">
        <div>
            <label class="font-semibold" for="name" v-text="label"/>
        </div>
        <div class="xl:col-span-2">
            <slot></slot>
            <!-- TODO: Show validation messages -->
        </div>
    </div>
</template>
