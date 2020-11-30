<template>
    <div class="container flex justify-center py-4">
        <div class="lg:w-2/5">
            <h1 class="text-4xl font-semibold mb-6">Timy</h1>

            <PushButton @start="onStart" @add="onAdd"/>

            <h2 class="text-2xl font-semibold mb-6">Last entries</h2>

            <table class="w-full">
                <thead class="text-left">
                <tr>
                    <th>Title</th>
                    <th>Start</th>
                    <th>Duration</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(time, index) in times">
                    <td class="py-2">{{ time.title }}</td>
                    <td class="py-2">{{ time.start }}</td>
                    <td class="py-2">{{ time.duration }}h</td>
                    <td class="py-2">
                        <button
                            class="bg-blue-600 text-white rounded px-2 py-1 mr-2"
                            @click="onEdit(time)"
                        >
                            Edit
                        </button>
                        <button
                            class="bg-red-600 text-white rounded px-2 py-1"
                            @click="onDelete(index)"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
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

        onDelete(index) {
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
