<script setup lang="ts">
import Button from "./Button.vue";
import { nextTick, ref, toRefs, watch } from "vue";
import IconCross from "../icons/Cross.vue";

const props = defineProps<{ title: string; show: boolean }>();
const { title, show } = toRefs(props);
const modal = ref<HTMLInputElement | null>(null);
const emit = defineEmits<{
    (e: "close"): void;
    (e: "submit"): void;
}>();

watch(show, async (val) => {
    if (!val) return;
    await nextTick();
    modal.value?.focus();
});

function onEsc() {
    emit("close");
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="show"
                class="flex fixed z-50 inset-0 bg-black/50 transition-opacity duration-300 p-2 overflow-y-auto"
                ref="modal"
                tabindex="0"
                @keydown.esc="onEsc"
            >
                <form
                    class="modal-container w-full max-w-[800px] m-auto bg-gray-100 border rounded shadow-lg transition-all duration-300"
                    @submit.prevent="$emit('submit')"
                >
                    <div class="flex justify-between border-b px-4 py-3">
                        <h2 class="text-xl font-semibold text-gray-700" v-text="title" />
                        <button class="leading-none text-3xl p-0 m-0" title="Schliessen" @click="$emit('close')">
                            <IconCross :size="24" />
                        </button>
                    </div>

                    <div class="px-4 py-3 bg-white">
                        <slot></slot>
                    </div>

                    <footer class="flex justify-end border-t px-4 py-3">
                        <Button type="submit" label="Speichern" />
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
