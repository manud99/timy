import { Ref, ref } from "vue";
import CustomDate from "./CustomDate";

export const firstOpened: Ref<CustomDate | null> = ref(null);
const TIMY_FIRST_OPENED_KEY: string = "timy_first_opened";

export function storeFirstOpenedTime() {
    // Record time when the app was first opened that day
    const now = CustomDate.now();
    firstOpened.value = new CustomDate(window.localStorage.getItem(TIMY_FIRST_OPENED_KEY) || "");
    if (!firstOpened.value.isValidDate() || !firstOpened.value.isOnSameDay(now)) {
        firstOpened.value = now;
        window.localStorage.setItem(TIMY_FIRST_OPENED_KEY, firstOpened.value.toString());
    }
}
