<script setup lang="ts">
import Page from "../components/Page.vue";
import Section from "../components/Section.vue";
import Table from "../components/Table.vue";
import {ref} from "vue";

const fields = [
    {
        id: 'subject',
        label: 'Fach',
    },
    {
        id: 'description',
        label: 'Beschreibung',
    },
    {
        id: 'day',
        label: 'Datum',
    },
    {
        id: 'time',
        label: 'Zeit',
    },
    {
        id: 'action',
        label: 'Aktionen',
    },
];
const timeEntries = ref([
]);
</script>

<template>
    <Page title="Dashboard">
        <Section title="Einträge">
            <Table :fields="fields" :values="timeEntries">

            </Table>
        </Section>
    </Page>
</template>
