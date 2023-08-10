<script setup lang="ts">
import { inject } from "vue";
import type { Ref } from "vue";
import { locationKey } from "../keys";

const { href } = defineProps<{ href: string }>();
const location = inject<Ref<string>>(locationKey);

function navigate() {
    if (!location) {
        console.warn("Could not find 'location' from root component");
        return;
    }

    window.history.pushState(null, "", href);
    location.value = href;
}
</script>

<template>
    <a :href="href" @click.prevent="navigate">
        <slot></slot>
    </a>
</template>
