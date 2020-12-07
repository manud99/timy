<template>
    <div class="flex items-center">
        <label :for="name" class="w-full md:w-1/3 font-semibold text-lg pr-4" v-text="label"/>

        <div class="w-full md:w-2/3 flex justify-between">
            <button class="border border-indigo-500 text-indigo-500 rounded px-4 mr-4"
                    type="button"
                    @click="onModify(false)">
                -{{ roundingFactor }} min
            </button>

            <input
                :value="modelValue"
                class="border rounded px-4 py-2"
                style="width: 150px"
                type="text"
                :id="name"
                :name="name"
                :placeholder="label"
                ref="input"
                @input="onInput"
            >

            <button class="border border-indigo-500 text-indigo-500 rounded px-4 ml-4"
                    type="button"
                    @click="onModify(true)">
                +{{ roundingFactor }} min
            </button>
        </div>
    </div>
</template>

<script>
import app from '../config/app.json';
import { formatIntParts, minutesToParts } from "../client/dates";

export default {
    props: {
        modelValue: {
            type: String,
        },
        label: {
            type: String,
        },
        name: {
            type: String,
        },
    },

    data() {
        return {
            roundingFactor: app.roundingFactor,
        };
    },

    computed: {
        minutes() {
            if (! this.modelValue) return 0;

            const parts = this.modelValue.split(':');

            if (parts.length !== 2) return 0;

            return Number(parts[0]) * 60 + Number(parts[1]);
        },
    },

    methods: {
        onInput(event) {
            this.emit(event.target.value);
        },

        onModify(plus = true) {
            const newValue = this.format(this.minutes + (plus ? 1 : -1) * this.roundingFactor);

            this.$refs.input.value = newValue;
            this.emit(newValue);
        },

        emit(value) {
            this.$emit('update:modelValue', value);
        },

        format(totalMinutes) {
            const { hours, minutes } = minutesToParts(totalMinutes);

            return formatIntParts(hours, minutes);
        },
    },
};
</script>