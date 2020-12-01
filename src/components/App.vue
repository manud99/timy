<template>
    <div class="container flex justify-center py-4">
        <div class="lg:w-1/2 bg-white rounded-lg py-4">
            <h1 class="text-4xl text-center uppercase text-indigo-600 font-bold border-b border-gray-300 px-4 pb-4 mb-6">
                Timy</h1>

            <div class="border-b border-gray-300 px-4 mb-6">
                <PushButton @start="onStart" @add="onAdd"/>
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
                        <td class="border-b border-gray-300 px-2 py-3">{{ time.end }}</td>
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

    <Modal ref="modal" :entry="activeEntry" :type="activeType" @submit="onSubmit" @close="resetActiveEntry"/>
</template>

<script>
import Axios from 'axios';
import PushButton from './PushButton';
import Modal from './Modal';

export default {
    components: {
        PushButton,
        Modal,
    },

    data() {
        return {
            times: [],
            modalOpen: false,
            activeEntry: null,
            activeType: 0,
        };
    },

    created() {
        this.getData();
    },

    methods: {
        async getData() {
            const response = await Axios.get('/api/v1/times');
            this.times = response.data.data;
        },

        onSubmit(entry) {
            if (this.activeEntry) {
                this.updateEntry(entry, this.activeEntry.id);
            } else {
                this.addEntry(entry);
            }
        },

        async addEntry(entry) {
            const response = await Axios.post('/api/v1/times', {
                title: entry.title,
                type: entry.type,
            });

            this.times.push(response.data.data);

            this.resetActiveEntry();
        },

        async updateEntry(entry, id) {
            const response = await Axios.put(`/api/v1/times/${id}`, {
                title: entry.title,
                type: entry.type,
            });

            const index = this.times.findIndex((time) => time.id === id);
            this.times[index] = { ...this.activeEntry, ...response.data.data };
        },

        async onStart() {
            await Axios.post('/api/v1/times', {
                title: '',
                type: 0,
            });

            this.resetActiveEntry();
        },

        onAdd(type) {
            this.activeEntry = null;
            this.activeType = type;
            this.openModal();
        },

        onEdit(entry) {
            this.activeEntry = entry;
            this.activeType = entry.type;
            this.openModal();
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

        resetActiveEntry() {
            this.activeEntry = null;
        },
    },
};
</script>
