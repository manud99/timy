<template>
    <div class="flex -mx-6">
        <div v-if="! running" class="px-6 mb-6">
            <button
                class="text-2xl font-semibold bg-green-600 text-white rounded-2xl px-12 py-3"
                @click="onStart"
                v-text="'Start'"
            />
        </div>
        <div v-if="running" class="px-6 mb-6">
            <button
                class="text-2xl font-semibold bg-blue-600 text-white rounded-2xl px-12 py-3"
                @click="onSplit"
                v-text="'Split'"
            />
        </div>
        <div v-if="running" class="px-6 mb-6">
            <button
                class="text-2xl font-semibold bg-red-600 text-white rounded-2xl px-12 py-3"
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
        },

        onSplit() {
            this.running = true;

            this.addEntry();
        },

        onStop() {
            this.running = false;

            this.addEntry();
        },

        addEntry() {
            this.$emit('add');
        }
    },
};
</script>