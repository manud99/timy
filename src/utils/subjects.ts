import { Ref, ref } from "vue";
import { Subject } from "../@types/models";

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
    return { name, color: 0, isActive: true };
}

export function getSubjects(): Ref<Subject[]> {
    loadSubjects();
    return subjects;
}

export function createSubject(subject: Subject): void {
    subjects.value.push(subject);
    storeSubjects();
}

export function updateSubject(subject: Subject, index: number): void {
    subjects.value.splice(index, 1, subject);
    storeSubjects();
}

export function deleteSubject(index: number): void {
    subjects.value.splice(index, 1);
    storeSubjects();
}

export interface SubjectColorSetting {
    name: string;
    backgroundColor: string;
    borderColor: string;
    color: string;
    contrast: string;
}

const colorMap: { [key: number]: SubjectColorSetting } = {
    1: {
        name: "Yellow",
        backgroundColor: "hsl(50deg 92% 56%)",
        borderColor: "hsl(50deg 92% 49%)",
        color: "rgb(0 0 0 / 76%)",
        contrast: "bg-white/50",
    },
    2: {
        name: "Red",
        backgroundColor: "hsl(16deg 95% 63%)",
        borderColor: "hsl(16deg 95% 56%)",
        color: "hsl(0deg 0% 100% / 91%)",
        contrast: "bg-white/20",
    },
    3: {
        name: "Pink",
        backgroundColor: "hsl(331deg 100% 65%)",
        borderColor: "hsl(331deg 100% 58%)",
        color: "hsl(330deg 17% 18%)",
        contrast: "bg-white/20",
    },
    4: {
        name: "Purple",
        backgroundColor: "hsl(280deg 69% 74%)",
        borderColor: "hsl(280deg 69% 67%)",
        color: "hsl(280deg 30% 13%)",
        contrast: "bg-white/50",
    },
    5: {
        name: "Turquoise",
        backgroundColor: "hsl(179deg 86% 40%)",
        borderColor: "hsl(179deg 86% 33%)",
        color: "hsl(179deg 34% 13%)",
        contrast: "bg-white/50",
    },
    6: {
        name: "Ligthblue",
        backgroundColor: "hsl(196deg 100% 71%)",
        borderColor: "hsl(196deg 100% 64%)",
        color: "hsl(196deg 34% 13%)",
        contrast: "bg-white/50",
    },
    7: {
        name: "Darkgreen",
        backgroundColor: "hsl(150deg 100% 27%)",
        borderColor: "hsl(150deg 100% 18%)",
        color: "hsl(150deg 34% 93%)",
        contrast: "bg-white/20",
    },
    8: {
        name: "Lightgreen",
        backgroundColor: "hsl(120deg 74% 64%)",
        borderColor: "hsl(120deg 74% 57%)",
        color: "hsl(120deg 20% 10%)",
        contrast: "bg-white/50",
    },
};

export function getSubjectColor(subject: Subject | null): SubjectColorSetting {
    if (!subject || !colorMap[subject.color]) {
        return {
            name: "Fallback",
            backgroundColor: "black",
            borderColor: "gray",
            color: "white",
            contrast: "bg-white/50",
        };
    }

    return colorMap[subject.color];
}

export function parseSubject(subject: string) {
    const matches = subject.match(/^\[([A-Za-zÀ-ž0-9-_ ]+)\] (.*)$/);
    if (!matches) {
        return { subject: null, description: subject };
    }
    return { subject: getSubject(matches[1]), description: matches[2] };
}
