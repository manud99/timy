<script setup lang="ts">
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import Axios from "axios";
import type { Subject } from "../../@types/models";
import Page from "../components/Page.vue";
import Section from "../components/Section.vue";
import Button, { ButtonSize } from "../components/Button.vue";
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
const showModal: Ref<boolean> = ref(false);
const activeSubject: Ref<Subject | null> = ref(null);

async function getSubjects() {
    try {
        return (await Axios.get("/api/subjects")).data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function showCreateModal() {
    activeSubject.value = null;
    showModal.value = true;
}

function showUpdateModal(entry: Object) {
    activeSubject.value = entry as Subject;
    showModal.value = true;
}

function createSubject(subject: Subject) {
    showModal.value = false;
    subjects.value.push(subject);
}

function updateSubject(subject: Subject) {
    showModal.value = false;
    const index = subjects.value.findIndex((el: Subject) => el.id === subject.id);
    subjects.value.splice(index, 1, subject);
}

async function deleteSubject(index: number) {
    const id = subjects.value[index]?.id;
    try {
        await Axios.delete(`/api/subjects/${id}`);
        subjects.value.splice(index, 1);
        console.log("subject deleted", index, id);
    } catch (err) {
        console.error("Could not delete subject", err);
    }
}

onMounted(async () => {
    subjects.value = await getSubjects();
});
</script>

<template>
    <Page title="Fächer">
        <Button
            class="mb-6"
            label="Neues Fach erstellen"
            :size="ButtonSize.XL"
            color="green"
            fullWidth
            @click="showCreateModal"
        />
        <Section title="Einträge">
            <Table :fields="fields" :values="subjects">
                <template #cell(actions)="{ entry, index }">
                    <Button class="mr-2" :size="ButtonSize.SM" label="Bearbeiten" @click="showUpdateModal(entry)" />
                    <Button :size="ButtonSize.SM" label="Löschen" @click="deleteSubject(index)" />
                </template>
            </Table>
        </Section>
    </Page>
    <UpdateSubjectModal
        :subject="activeSubject"
        :show="showModal"
        @close="showModal = false"
        @create="createSubject"
        @update="updateSubject"
    />
</template>
