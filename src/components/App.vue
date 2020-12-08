<template>
    <div class="container flex justify-center py-4">
        <div class="lg:w-1/2 bg-white rounded-lg py-4">
            <h1 class="text-4xl text-center uppercase text-indigo-600 font-bold border-b border-gray-300 px-4 pb-4 mb-6">
                Timy
            </h1>

            <div class="border-b border-gray-300 px-4 mb-6">
                <PushButton :running="running" @start="onStart" @add="onAdd"/>
            </div>

            <div class="px-4">
                <h2 class="text-2xl text-indigo-600 font-semibold mb-6">Your Time Entries</h2>
                <!-- TODO: Select day box -->

                <table class="w-full">
                    <thead class="text-left">
                    <tr>
                        <th class="w-full text-lg border-t border-b-2 border-gray-300 px-4 py-3">Title</th>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-4 py-3">Start</th>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-4 py-3">End</th>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-4 py-3">Duration</th>
                        <th class="text-lg border-t border-b-2 border-gray-300 px-4 py-3">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="(entry, index) in entries">
                        <tr v-if="entry.breakBefore !== false">
                            <td class="bg-green-800 font-semibold text-lg text-white text-center px-4 py-2" colspan="5">
                                {{ `Break: ${entry.breakBefore}` }}
                            </td>
                        </tr>

                        <tr :class="entry.backgroundColor">
                            <td class="border-b border-gray-300 px-4 py-3">
                                <span v-if="entry.title">{{ entry.title }}</span>
                                <span v-else class="text-gray-400">Currently working on ...</span>
                            </td>
                            <td class="border-b border-gray-300 px-4 py-3">
                                {{ entry.start }}
                            </td>
                            <td class="border-b border-gray-300 px-4 py-3">
                                <span v-if="entry.end">{{ entry.end }}</span>
                                <Spinner v-else/>
                            </td>
                            <td class="border-b border-gray-300 text-right px-4 py-3">
                                {{ formatDuration(entry.duration) }}
                            </td>
                            <td class="border-b border-gray-300 whitespace-nowrap px-4 py-3">
                                <button
                                    class="bg-indigo-600 text-white rounded px-2 py-1 mr-2"
                                    type="button"
                                    @click="onEdit(entry)"
                                >
                                    {{ entry.end ? 'Edit' : 'Stop' }}
                                </button>

                                <button
                                    class="bg-red-600 text-white rounded px-2 py-1"
                                    type="button"
                                    @click="onDelete(entry, index)"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Modal ref="modal" :entry="activeEntry" @add="addEntry" @update="updateEntry"/>
</template>

<script>
import Axios from 'axios';
import PushButton from './PushButton';
import Modal from './Modal';
import Spinner from './Spinner';
import { calculateDuration, formatDate, getRoundedTime, minutesToParts, parseDate } from "../client/dates";

// TODO: Structure component with new composition API
export default {
    components: {
        PushButton,
        Modal,
        Spinner,
    },

    data() {
        return {
            entries: [],
            editedEntry: null,
            runningEntry: null,
            isSplitting: false,
            durationUpdater: null,
        };
    },

    computed: {
        activeEntry() {
            return this.editedEntry || this.runningEntry || null;
        },

        running() {
            return !! this.runningEntry;
        },
    },

    created() {
        this.getEntries();

        this.durationUpdater = setInterval(this.updateDurations, 15000);
    },

    unmounted() {
        clearInterval(this.durationUpdater);
    },

    methods: {
        // Data management
        async getEntries() {
            const response = await Axios.get('/api/v1/times');
            this.entries = response.data.data;

            if (this.entries.length !== 0) {
                this.runningEntry = this.entries.find((entry) => entry.end === null);
            }

            this.addBreaksAndBackgroundColors();
        },

        sortEntries() {
            this.entries.sort((a, b) => {
                return a.start.localeCompare(b.start);
            });
        },

        addBreaksAndBackgroundColors() {
            this.entries.forEach((entry, index, array) => {
                entry.breakBefore = false;
                entry.backgroundColor = index % 2 === 0 ? 'bg-gray-200' : '';

                if (index === 0) return;
                const previousEntry = array[index - 1];

                if (entry.start > previousEntry.end) {
                    entry.breakBefore = this.formatDuration(
                        calculateDuration(
                            parseDate(previousEntry.end),
                            parseDate(entry.start),
                        ),
                    );
                }

                if (entry.start < previousEntry.end) {
                    entry.backgroundColor = 'bg-yellow-400';
                }
            });
        },

        // Header buttons
        async onStart() {
            const response = await Axios.post('/api/v1/times', {
                title: null,
                start: getRoundedTime(),
            });

            const entry = response.data.data;
            this.addEntry(entry);

            this.runningEntry = entry;
        },

        onAdd(isSplitting = false) {
            if (! this.runningEntry) {
                this.runningEntry = {
                    start: formatDate(getRoundedTime(1)),
                };
            }

            this.runningEntry.end = formatDate(getRoundedTime());
            this.isSplitting = isSplitting;

            this.openModal();
        },

        // Table buttons
        onEdit(entry) {
            this.editedEntry = entry;

            if (! this.editedEntry.end) {
                this.editedEntry.end = formatDate(getRoundedTime());
            }

            this.openModal();
        },

        async onDelete(entry, index) {
            await Axios.delete(`/api/v1/times/${entry.id}`);

            this.entries.splice(index, 1);
        },

        // Modal actions and callbacks
        openModal() {
            this.$refs.modal.open();
        },

        closeModal() {
            this.$refs.modal.close();
        },

        addEntry(entry) {
            this.entries.push(entry);
            this.sortEntries();
            this.addBreaksAndBackgroundColors();
        },

        updateEntry(id, newValues) {
            const index = this.entries.findIndex((time) => time.id === id);

            this.entries[index] = { ...this.entries[index], ...newValues };

            this.sortEntries();
            this.addBreaksAndBackgroundColors();

            this.editedEntry = null;
            this.runningEntry = null;

            if (this.isSplitting) {
                this.onStart();
                this.isSplitting = false;
            }
        },

        // Duration handlers
        updateDurations() {
            this.entries.forEach((entry) => {
                if (entry.end) return;

                entry.duration = calculateDuration(parseDate(entry.start), new Date());
            });
        },

        formatDuration(totalMinutes) {
            const { hours, minutes } = minutesToParts(totalMinutes);

            if (hours === 0) {
                return `${minutes}min`;
            }

            return `${hours}h ${minutes}min`;
        },
    },
};
</script>
