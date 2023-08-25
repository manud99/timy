<template>
    <div class="container mx-auto pt-4 px-4">
        <h1 class="hidden">
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
