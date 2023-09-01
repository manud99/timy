<script setup lang="ts">
import { computed } from "vue";
import { baseUrl, navigate } from "../utils/routing";

const props = defineProps<{ page: string }>();

const href = computed(() => {
    if (!baseUrl.value) return "/" + props.page;
    return baseUrl.value + props.page;
});
</script>

<template>
    <a :href="href" @click.prevent="navigate(page)">
        <slot></slot>
    </a>
</template>
