<script setup lang="ts">
import type {Ref} from "vue";
import {onMounted, ref} from "vue";
import Axios from "axios";
import type {Subject} from "../../node_modules/.prisma/client";
import Page from "../components/Page.vue";
import Section from "../components/Section.vue";
import Button, {ButtonSize} from "../components/Button.vue";
import UpdateSubjectModal from "../modals/UpdateSubjectModal.vue";
import Table from "../components/Table.vue";

const fields = [
    {
        id: "name",
        label: "Name",
    },
    {
        id: "actions",
        label: "Aktionen",
    },
];
const subjects: Ref<Subject[]> = ref([]);
const showUpdateModal: Ref<boolean> = ref(false);
const activeSubject: Ref<Subject | undefined> = ref();

async function getSubjects() {
    try {
        return (await Axios.get("/api/subjects")).data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

onMounted(async () => {
    subjects.value = await getSubjects();
});
</script>

<template>
    <Page title="Fächer">
        <Button class="mb-6" label="Neues Fach erstellen" :size="ButtonSize.XL" color="green" fullWidth @click="showUpdateModal = true" />
        <Section title="Einträge">
            <Table :fields="fields" :values="subjects">
                <template #cell(actions)="{entry}">
                    <Button class="mr-2" :size="ButtonSize.SM" label="Bearbeiten" @click="activeSubject = entry; showUpdateModal = true" />
                    <Button :size="ButtonSize.SM" label="Löschen" />
                </template>
            </Table>
        </Section>
    </Page>
    <UpdateSubjectModal :value="activeSubject" :show="showUpdateModal" @close="showUpdateModal = false" />
</template>
