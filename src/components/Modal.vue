<script setup lang="ts">
import Button from './Button.vue';

const {title, show} = defineProps<{ title: string, show: boolean }>();

defineEmits<{
    (e: 'close'): void
    (e: 'submit'): void
}>();
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="flex fixed z-50 inset-0 bg-black/50 transition-opacity duration-300">
                <form class="modal-container w-[600px] m-auto bg-white border rounded shadow-lg transition-all duration-300" @submit.prevent="$emit('submit')">
                    <div class="flex justify-between border-b px-4 py-3">
                        <h2 class="text-xl font-bold" v-text="title" />
                        <button class="leading-none text-3xl p-0 m-0" title="Schliessen" @click="$emit('close')">&times;</button>
                    </div>

                    <div class="px-4 py-3">
                        <slot></slot>
                    </div>

                    <footer class="flex justify-end border-t px-4 py-3">
                        <Button
                            type="submit"
                            label="Speichern"
                        />
                    </footer>
                </form>
            </div>
        </Transition>
    </Teleport>
</template>

<style>
/* Transition properties */
.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    transform: scale(1.1);
}
</style>
