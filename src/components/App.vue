<template>
    <div class="container">
        <h1 class="text-4xl font-semibold mb-6">Timy</h1>

        <PushButton @add="addEntry"/>

        <h2>list with all recorded times of the day.</h2>
        <div>
            <div v-for="time in times">
                {{ time.title }}
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios';
import PushButton from './PushButton';

export default {
    components: {
        PushButton,
    },

    data() {
        return {
            times: [],
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

        async addEntry() {
            const response = await Axios.post('/api/v1/times', {
                title: 'some title',
            });

            console.log(response.data.data);
        },
    },
};
</script>
