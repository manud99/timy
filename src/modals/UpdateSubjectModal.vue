<script setup lang="ts">
import {PropType, ref} from "vue";
import type Ref from "vue";
import Modal from '../components/Modal.vue';
import FormGroup from '../components/FormGroup.vue';
import InputField from '../components/InputField.vue';

interface ValueProp {
    name: string,
}

const name: Ref<string> = ref('');

const {show} = defineProps({
    show: Boolean,
    value: Object as PropType<ValueProp> | undefined,
});

defineEmits<{
    (e: 'close'): void
}>();
</script>

<template>
    <Modal title="Fach bearbeiten" :show="show" @close="$emit('close')" @submit="$emit('submit')">
        <FormGroup label="Name" name="name">
            <InputField v-model:value="name" name="name"/>
        </FormGroup>
    </Modal>
</template>
