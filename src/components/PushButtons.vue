<template>
    <div class="flex flex-wrap -mx-4">
        <template v-if="! running">
            <div class="w-full sm:w-1/2 px-4 mb-6">
                <button
                    class="w-full font-semibold text-2xl text-white uppercase tracking-wide border border-green-900 bg-green-600 hover:bg-green-500 focus:bg-green-500 rounded-xl shadow-lg px-12 py-3"
                    @click="onStart"
                    v-text="'Start'"
                />
            </div>
            <div class="w-full sm:w-1/2 px-4 mb-6">
                <button
                    class="w-full font-semibold text-2xl text-white uppercase tracking-wide border border-gray-900 bg-gray-600 hover:bg-gray-500 focus:bg-gray-500 rounded-xl shadow-lg px-12 py-3"
                    @click="onAdd"
                    v-text="'Add entry'"
                />
            </div>
        </template>

        <template v-else>
            <div class="w-full sm:w-1/2 px-4 mb-6">
                <button
                    class="w-full font-semibold text-2xl text-white uppercase tracking-wide border border-blue-900 bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 rounded-xl shadow-lg px-12 py-3"
                    @click="onSplit"
                    v-text="'Split'"
                />
            </div>
            <div class="w-full sm:w-1/2 px-4 mb-6">
                <button
                    class="w-full font-semibold text-2xl text-white uppercase tracking-wide border border-red-900 bg-red-600 hover:bg-red-500 focus:bg-red-500 rounded-xl shadow-lg px-12 py-3"
                    @click="onStop"
                    v-text="'Stop'"
                />
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        running: {
            type: Boolean,
            default: false,
        },
    },

    emits: ['update:running', 'start', 'add', 'split'],

    methods: {
        onStart() {
            this.$emit('start');
        },

        onAdd() {
            this.$emit('add', false);
        },

        onSplit() {
            this.$emit('add', true);
        },

        onStop() {
            this.$emit('add', false);
        },
    },
};
</script>