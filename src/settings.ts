import { Ref, ref } from "vue";

interface Settings {
    calendarId: string;
}

const STORAGE_KEY: string = "timy_settings";
const settings: Ref<Settings> = ref({ calendarId: "" });
let loaded: boolean = false;

function loadSettings(): void {
    if (loaded) {
        return;
    }

    const storageItem = window.localStorage.getItem(STORAGE_KEY);
    loaded = true;
    if (!storageItem) {
        return;
    }

    const content = JSON.parse(storageItem);
    settings.value.calendarId = content.calendarId || "";
}

function storeSettings(): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
}

export function getCalendarId(): string {
    loadSettings();

    return settings?.value.calendarId || "";
}

export function setCalendarId(calendarId: string): void {
    loadSettings();
    settings.value.calendarId = calendarId;
    storeSettings();
}
