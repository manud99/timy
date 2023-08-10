<template>
    <div class="container mx-auto px-4">
        <h2 class="my-6 text-2xl font-semibold text-gray-700">
            {{ title }}
        </h2>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        title: String,
    },
});
</script>
