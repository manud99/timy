<template>
    <div class="container flex justify-center py-4">
        <div class="lg:w-1/2 bg-white rounded-lg py-4">
            <h1 class="text-4xl text-center uppercase text-indigo-600 font-bold border-b border-gray-300 px-4 pb-4 mb-6">
                Timy
            </h1>

            <div class="border-b border-gray-300 px-4 mb-6">
                <PushButton v-model:running="running" @start="onStart" @add="onAdd" />
            </div>

            <div class="px-4">
                <h2 class="text-2xl text-indigo-600 font-semibold mb-6">Time Entries</h2>

                <table class="w-full">
                    <thead class="text-left">
                    <tr>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-2 py-3">Title</th>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-2 py-3">Start</th>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-2 py-3">End</th>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-2 py-3">Duration</th>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-2 py-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(time, index) in times" :class="{'bg-gray-200': index % 2 === 0}">
                        <td class="border-b border-gray-300 px-2 py-3">{{ time.title }}</td>
                        <td class="border-b border-gray-300 px-2 py-3">{{ time.start }}</td>
                        <td class="border-b border-gray-300 px-2 py-3">
                            <span v-if="time.end">{{ time.end }}</span>
                            <!-- <spinner v-else /> -->
                        </td>
                        <td class="border-b border-gray-300 px-2 py-3">{{ time.duration }}h</td>
                        <td class="border-b border-gray-300 px-2 py-3">
                            <button
                                class="bg-indigo-600 text-white rounded px-2 py-1 mr-2"
                                @click="onEdit(time)"
                            >
                                Edit
                            </button>
                            <button
                                class="bg-red-600 text-white rounded px-2 py-1"
                                @click="onDelete(time, index)"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Modal ref="modal" :entry="activeEntry" @add="onAddEntry" @update="onUpdateEntry" />
</template>

<script>
import Axios from 'axios';
import PushButton from './PushButton';
import Modal from './Modal';
import { formatDate, getRoundedTime, prepareDate } from "../client/dates";

export default {
    components: {
        PushButton,
        Modal,
    },

    data() {
        return {
            running: false,
            times: [],
            modalOpen: false,
            activeEntry: null,
            isSplitting: true,
        };
    },

    created() {
        this.getData();

        // TODO: Automatically update the duration of unfinished entries.
    },

    methods: {
        async getData() {
            const response = await Axios.get('/api/v1/times');
            this.times = response.data.data;

            this.checkIfIsRunning();
        },

        checkIfIsRunning() {
            if (this.times.length === 0) return;

            this.activeEntry = this.times[this.times.length - 1];
            this.running = this.activeEntry.end === null;
        },

        async onStart() {
            const response = await Axios.post('/api/v1/times', {
                title: null,
                start: getRoundedTime(),
            });

            const entry = response.data.data;
            this.times.push(entry);
            this.activeEntry = entry;
        },

        onAdd(isSplitting = false) {
            this.activeEntry.end = formatDate(getRoundedTime());
            this.isSplitting = isSplitting;

            this.openModal();
        },

        onEdit(entry) {
            this.activeEntry = entry;
            this.openModal();
        },

        onAddEntry(entry) {
            this.times.push(entry);
        },

        onUpdateEntry(entry, id) {
            const index = this.times.findIndex((time) => time.id === id);

            this.times[index] = { ...this.activeEntry, ...entry };

            if (this.isSplitting) {
                this.onStart();
                this.isSplitting = false;
            }
        },

        async onDelete(entry, index) {
            await Axios.delete(`/api/v1/times/${entry.id}`);

            this.times.splice(index, 1);
        },

        openModal() {
            this.$refs.modal.open();
        },

        closeModal() {
            this.$refs.modal.close();
        },
    },
};
</script>
