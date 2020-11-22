<template>
    <div class="container text-center">
        <h1 v-if="name" class="text-4xl font-semibold">{{ greeting }} {{ name }}!</h1>
    </div>
</template>

<script>
import Axios from 'axios';

export default {
    data: () => {
        return {
            greeting: 'Hello',
            name: '',
        };
    },

    created() {
        this.getData();
    },

    methods: {
        async getData() {
            const response = await Axios.get('/hello');
            this.name = response.data.data;
        }
    }
};
</script>
