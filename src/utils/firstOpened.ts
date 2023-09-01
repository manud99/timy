import { Ref, ref } from "vue";
import { isOnSameDay } from "./date";

export const firstOpened: Ref<string | null> = ref(null);
const TIMY_FIRST_OPENED_KEY: string = "timy_first_opened";

export function storeFirstOpenedTime() {
    // Record time when the app was first opened that day
    const now = new Date();
    firstOpened.value = window.localStorage.getItem(TIMY_FIRST_OPENED_KEY);
    if (!firstOpened.value || !isOnSameDay(firstOpened.value, now)) {
        firstOpened.value = now.toISOString();
        window.localStorage.setItem(TIMY_FIRST_OPENED_KEY, firstOpened.value);
    }
}
