<template>
    <div class="container mx-auto pt-4 px-1 md:px-4">
        <h1 class="sr-only">
            {{ title }}
        </h1>
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
