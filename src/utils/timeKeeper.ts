import { Ref, ref } from "vue";
import CustomDate from "./CustomDate";

export const startTime: Ref<CustomDate | null> = ref(null);
const TIMY_START_TIME: string = "timy_start_time";

export function autoStartDay() {
    // Record time when the app was first opened that day
    const now = CustomDate.now();
    startTime.value = new CustomDate(window.localStorage.getItem(TIMY_START_TIME) || "");

    if (!startTime.value.isValidDate() || !startTime.value.isOnSameDay(now)) {
        setStartTime(now);
    }
}

export function setStartTime(date: CustomDate) {
    startTime.value = date;
    window.localStorage.setItem(TIMY_START_TIME, startTime.value.toString());
}
