<script setup lang="ts">
import { watch, toRefs } from "vue";
import Modal from "../components/Modal.vue";
import { signIn } from "../google/utils";
import Button, { ButtonSize } from "../components/Button.vue";
import { ready } from "../google/plugin";

const props = defineProps<{ show: boolean }>();
const { show } = toRefs(props);

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
        if (ready.value) {
            emit("close");
        }
    });
}
</script>

<template>
    <Modal title="Anmelden" :show="show" :no-footer="true" :width="500" @close="emit('close')" :z-index="20">
        <div class="">
            <p class="mb-2">Bitte melde dich mit einem Google-Account an, um deine Zeiteinträge zu verwalten:</p>
            <Button
                class="flex items-center"
                label="Neues Eintrag erstellen"
                :size="ButtonSize.LG"
                color="blue"
                @click="signIn"
            >
                Jetzt mit Google-Account anmelden
            </Button>
        </div>
    </Modal>
</template>
