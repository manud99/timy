<script setup lang="ts">
import { computed, inject } from "vue";
import type { Ref } from "vue";
import { baseUrlKey, locationKey } from "../keys";

const props = defineProps<{ page: string }>();
const location = inject<Ref<string>>(locationKey);

function navigate() {
    if (!location) {
        console.warn("Could not find 'location' from root component");
        return;
    }

    const url = (baseUrl || "/") + props.page;
    window.history.pushState(null, "", url);
    location.value = (baseUrl || "/") + props.page;
}

let baseUrl = inject(baseUrlKey);
const href = computed(() => {
    if (!baseUrl) return "/" + props.page;
    return baseUrl + props.page;
})
</script>

<template>
    <a :href="href" @click.prevent="navigate">
        <slot></slot>
    </a>
</template>
