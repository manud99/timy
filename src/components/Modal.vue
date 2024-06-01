<script setup lang="ts">
import Button from "./Button.vue";
import { nextTick, ref, toRefs, watch } from "vue";
import IconCross from "../icons/Cross.vue";

const props = withDefaults(
    defineProps<{
        title: string;
        submitTitle?: string;
        show: boolean;
        noFooter?: boolean;
        width?: number;
        zIndex?: number;
    }>(),
    {
        submitTitle: "Speichern",
        noFooter: false,
        width: 800,
        zIndex: 10,
    }
);
const { title, show } = toRefs(props);
const emit = defineEmits<{
    (e: "close"): void;
    (e: "submit"): void;
}>();

const modalBody = ref<HTMLElement | null>(null);

watch(show, async (val) => {
    if (!val) return;
    await nextTick();

    (modalBody.value?.querySelector("[autofocus]") as HTMLElement)?.focus();
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
                :style="{ zIndex }"
                tabindex="0"
                @keydown.esc="onEsc"
            >
                <form
                    class="modal-container w-full m-auto bg-gray-100 border rounded shadow-lg transition-all duration-300"
                    :style="{ maxWidth: width + 'px' }"
                    @submit.prevent="$emit('submit')"
                >
                    <div class="flex justify-between border-b px-4 py-3">
                        <h2 class="text-xl font-semibold text-gray-700" v-text="title" />
                        <button
                            class="leading-none text-3xl p-0 m-0"
                            title="Schliessen"
                            type="button"
                            @click="$emit('close')"
                        >
                            <IconCross :size="24" />
                        </button>
                    </div>

                    <div class="px-2 md:px-4 py-3 bg-white" id="modal-body" ref="modalBody">
                        <slot></slot>
                    </div>

                    <footer v-if="!noFooter" class="flex justify-end border-t px-2 md:px-4 py-3">
                        <Button type="submit" :label="submitTitle" />
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
