<script setup lang="ts">
import { watch, toRefs, Ref, inject } from "vue";
import Modal from "../components/Modal.vue";
import { signIn } from "../google/utils";
import Button, { ButtonSize } from "../components/Button.vue";
import { googleReadyKey } from "../keys";

const props = defineProps<{ show: boolean }>();
const { show } = toRefs(props);

const ready = inject<Ref<boolean>>(googleReadyKey);

const emit = defineEmits<{
    (e: "close"): void;
}>();

watch(show, (val: boolean) => {
    if (!ready) {
        console.warn("Could not find google ready key");
        return;
    }

    if (val) {
        ready.value = false;
    }
});

if (ready) {
    watch(ready, (val: boolean) => {
        if (ready) {
            emit("close");
        }
    });
}
</script>

<template>
    <Modal title="Anmelden" :show="show" :no-footer="true" @close="emit('close')">
        <div class="text-center">
            <div>Bitte melde dich an</div>
            <Button
                class="flex items-center"
                label="Neues Eintrag erstellen"
                :size="ButtonSize.LG"
                color="blue"
                @click="signIn"
            >
                Anmelden
            </Button>
        </div>
    </Modal>
</template>
