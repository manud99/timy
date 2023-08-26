<script setup lang="ts">
import { Ref, ref, inject, computed, onMounted, watch } from "vue";
import Page from "../blocks/Page.vue";
import SignOutButton from "../components/SignOutButton.vue";
import Section from "../blocks/Section.vue";
import SelectField, { Option } from "../components/SelectField.vue";
import { getCalendarId, setCalendarId } from "../settings";
import { googleReadyKey } from "../keys";
import { fetchCalendars } from "../google/query";

const calendars: Ref<Option[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const calendar: Ref<string> = ref("");
const ready = inject<Ref<boolean>>(googleReadyKey);

async function getCalendars() {
    if (!ready || !ready.value) return;

    const res = await fetchCalendars();
    calendars.value = res.map((calendar: any) => {
        return { label: calendar.summary, value: calendar.id };
    });
}

function storeCalendar(value: string) {
    setCalendarId(value);
}

onMounted(() => {
    calendar.value = getCalendarId();
    getCalendars();
});

if (ready) {
    const stopWatcher = watch(ready, () => {
        getCalendars();
    });
}
</script>

<template>
    <Page title="Einstellungen">
        <!-- <Section class="flex justify-between items-center p-4 bg-white">
            <div>
                Du bist angemeldet als
                <strong>{{ account.name }}: {{ account.email }}</strong>
            </div>
            <SignOutButton
                class="inline-flex items-center font-medium leading-5 text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:ring-2 px-3 md:px-5 py-3 bg-blue-600 active:bg-blue-600 hover:bg-blue-700 ring-blue-700 flex items-center"
            />
        </Section> -->

        <Section class="items-center p-4 bg-white">
            <h2 class="text-lg font-bold mb-4">Kalender auswählen</h2>

            <SelectField
                v-model:value="calendar"
                @update:value="storeCalendar"
                :options="calendars"
                label="Bitte Kalender auswählen"
                name="calendar"
            />
        </Section>
    </Page>
</template>
