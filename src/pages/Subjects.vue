<script setup lang="ts">
import type { Ref } from "vue";
import { computed, onMounted, ref } from "vue";
import Page from "../blocks/Page.vue";
import Section from "../blocks/Section.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import Button, { ButtonSize } from "../components/Button.vue";
import EditSubjectModal from "../modals/EditSubjectModal.vue";
import Table from "../components/Table.vue";
import IconPlus from "../icons/Plus.vue";
import IconPencil from "../icons/Pencil.vue";
import IconGarbage from "../icons/Garbage.vue";
import { Subject } from "../@types/models";
import { subjects, getSubjects, createSubject, updateSubject, deleteSubject } from "../utils/subjects";

const fields = [
    {
        id: "name",
        label: "Fach",
    },
    {
        id: "actions",
        label: "Aktionen",
    },
];
const showModal: Ref<boolean> = ref(false);
const activeSubject: Ref<Subject | null> = ref(null);
const activeId: Ref<number> = ref(0);

const numActiveSujects = computed(() => {
    return subjects.value.filter((subject) => subject.isActive).length;
});

function showCreateModal() {
    activeSubject.value = null;
    showModal.value = true;
}

function showUpdateModal(entry: Object, index: number) {
    activeId.value = index;
    activeSubject.value = entry as Subject;
    showModal.value = true;
}

function updateItem(subject: Subject) {
    showModal.value = false;
    if (activeSubject.value === null) {
        createSubject(subject);
    } else {
        updateSubject(subject, activeId.value);
    }
}

function deleteItem(index: number) {
    deleteSubject(index);
}

onMounted(async () => {
    getSubjects();
});
</script>

<template>
    <Page title="Fächer">
        <Section class="flex flex-wrap justify-between gap-4 items-center p-4 bg-white">
            <div class="font-semibold text-gray-600 text-lg">
                {{ subjects.length }} Fächer gefunden, {{ numActiveSujects }} davon sind aktiv
            </div>
            <Button
                class="flex justify-center items-center w-full md:w-auto"
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
                        <Button
                            class="mr-2"
                            :size="ButtonSize.SM"
                            label="Bearbeiten"
                            @click="showUpdateModal(entry, index)"
                        >
                            <IconPencil class="mr-2" :size="16" />
                            <span>Bearbeiten</span>
                        </Button>
                        <Button :size="ButtonSize.SM" label="Löschen" @click="deleteItem(index)">
                            <IconGarbage class="mr-2" :size="12" />
                            <span>Löschen</span>
                        </Button>
                    </div>
                </template>
            </Table>
        </Section>
    </Page>
    <EditSubjectModal :subject="activeSubject" :show="showModal" @close="showModal = false" @update="updateItem" />
</template>
