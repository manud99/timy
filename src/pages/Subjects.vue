<script setup lang="ts">
import type { Ref } from "vue";
import { computed, onMounted, ref } from "vue";
import Axios from "axios";
import type { Subject } from "../../@types/models";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import Button, { ButtonSize } from "../components/Button.vue";
import EditSubjectModal from "../modals/EditSubjectModal.vue";
import Table from "../components/Table.vue";
import IconPlus from "../icons/Plus.vue";
import IconPencil from "../icons/Pencil.vue";
import IconGarbage from "../icons/Garbage.vue";

const fields = [
    {
        id: "name",
        label: "Markierung",
    },
    {
        id: "actions",
        label: "Aktionen",
    },
];
const subjects: Ref<Subject[]> = ref([]);
const showModal: Ref<boolean> = ref(false);
const activeSubject: Ref<Subject | null> = ref(null);

const numActiveSujects = computed(() => {
    return subjects.value.filter((subject) => subject.isActive).length;
});

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
        <Section class="flex justify-between items-center p-4 bg-white">
            <div class="font-semibold text-gray-600 text-lg">
                {{ subjects.length }} Fächer gefunden, {{ numActiveSujects }} davon sind aktiv
            </div>
            <Button
                class="flex items-center"
                label="Neues Fach erstellen"
                :size="ButtonSize.LG"
                color="blue"
                @click="showCreateModal"
            >
                <IconPlus class="mr-2" :size="12" />
                <span>Neues Fach erstellen</span>
            </Button>
        </Section>
        <Section>
            <Table :fields="fields" :values="subjects">
                <template #cell(name)="{ entry }">
                    <SubjectTag :subject="entry as Subject" />
                </template>

                <template #cell(actions)="{ entry, index }">
                    <div class="flex">
                        <Button class="mr-2" :size="ButtonSize.SM" label="Bearbeiten" @click="showUpdateModal(entry)">
                            <IconPencil class="mr-2" :size="16" />
                            <span>Bearbeiten</span>
                        </Button>
                        <Button :size="ButtonSize.SM" label="Löschen" @click="deleteSubject(index)">
                            <IconGarbage class="mr-2" :size="12" />
                            <span>Löschen</span>
                        </Button>
                    </div>
                </template>
            </Table>
        </Section>
    </Page>
    <EditSubjectModal
        :subject="activeSubject"
        :show="showModal"
        @close="showModal = false"
        @create="createSubject"
        @update="updateSubject"
    />
</template>
