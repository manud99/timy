<template>
    <div class="flex -mx-4">
        <div v-if="! running" class="w-full px-4 mb-6">
            <button
                class="w-full text-2xl font-semibold bg-green-600 text-white rounded-xl px-12 py-3"
                @click="onStart"
                v-text="'Start'"
            />
        </div>
        <div v-if="running" class="w-1/2 px-4 mb-6">
            <button
                class="w-full text-2xl font-semibold bg-blue-600 text-white rounded-xl px-12 py-3"
                @click="onSplit"
                v-text="'Split'"
            />
        </div>
        <div v-if="running" class="w-1/2 px-4 mb-6">
            <button
                class="w-full text-2xl font-semibold bg-red-600 text-white rounded-xl px-12 py-3"
                @click="onStop"
                v-text="'Stop'"
            />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            running: false,
        };
    },

    methods: {
        onStart() {
            this.running = true;

            this.$emit('start')
        },

        onSplit() {
            this.running = true;

            this.addEntry(1);
        },

        onStop() {
            this.running = false;

            this.addEntry(2);
        },

        addEntry(type) {
            this.$emit('add', type);
        }
    },
};
</script>