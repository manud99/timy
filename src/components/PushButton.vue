<template>
    <div class="flex -mx-4">
        <template v-if="! running">
            <div class="w-1/2 px-4 mb-6">
                <button
                    class="w-full text-2xl uppercase tracking-wide font-semibold bg-green-600 text-white rounded-xl px-12 py-3"
                    @click="onStart"
                    v-text="'Start'"
                />
            </div>
            <div class="w-1/2 px-4 mb-6">
                <button
                    class="w-full text-2xl uppercase tracking-wide font-semibold bg-gray-600 text-white rounded-xl px-12 py-3"
                    @click="onAdd"
                    v-text="'Add entry'"
                />
            </div>
        </template>

        <template v-else>
            <div class="w-1/2 px-4 mb-6">
                <button
                    class="w-full text-2xl uppercase tracking-wide font-semibold bg-blue-600 text-white rounded-xl px-12 py-3"
                    @click="onSplit"
                    v-text="'Split'"
                />
            </div>
            <div class="w-1/2 px-4 mb-6">
                <button
                    class="w-full text-2xl uppercase tracking-wide font-semibold bg-red-600 text-white rounded-xl px-12 py-3"
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
            this.$emit('update:running', true);

            this.$emit('start');
        },

        onAdd() {
            this.$emit('update:running', false);

            this.$emit('add', false);
        },

        onSplit() {
            this.$emit('update:running', true);

            this.$emit('add', true);
        },

        onStop() {
            this.$emit('update:running', false);

            this.$emit('add', false);
        },
    },
};
</script>