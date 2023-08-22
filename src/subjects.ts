import { Ref, ref } from "vue";
import { Subject } from "./@types/models";

const SUBJECTS_KEY: string = "timy_subjects";
let loaded: boolean = false;
export const subjects: Ref<Subject[]> = ref([]);

function loadSubjects() {
    if (loaded) return;

    const storageItem = window.localStorage.getItem(SUBJECTS_KEY);
    loaded = true;
    if (!storageItem) return;

    const content = JSON.parse(storageItem);
    if (!content) return;

    subjects.value = content;
}

function storeSubjects() {
    window.localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects.value));
}

export function getSubject(name: string): Subject {
    loadSubjects();
    const subject = subjects.value.find((record) => record.name === name);
    if (subject) return subject;
    return {name, color: 0, isActive: true};
}

export function getSubjects(): Ref<Subject[]> {
    loadSubjects();
    return subjects;
}

export function createSubject(subject: Subject): void {
    subjects.value.push(subject);
    storeSubjects();
}

export function updateSubject(subject: Subject): void {
    const index = subjects.value.findIndex((record) => record.name === subject.name);
    subjects.value.splice(index, 1, subject);
    storeSubjects();
}

export function deleteSubject(index: number): void {
    subjects.value.splice(index, 1);
    storeSubjects();
}
