<script setup lang="ts">
import Page from "../blocks/Page.vue";
import SignOutButton from "../components/SignOutButton.vue";
import Section from "../blocks/Section.vue";
import { useMsal, useMsalAuthentication } from "../microsoft/utils";
import { Ref, ref, computed, onMounted, watch } from "vue";
import { queryMsGraph } from "../microsoft/query";
import SelectField from "../components/SelectField.vue";
import { getCalendarId, setCalendarId } from "../settings";

interface Calendar {
    id: string;
    name: string;
    color: string;
    hex: string;
}

const { accounts } = useMsal();

const account = computed(() => {
    if (accounts.value.length > 0) {
        const account = accounts.value[0];
        if (account) {
            return { name: account.name || "", email: account.username || "" };
        }
    }
    return { name: "", email: "" };
});

const calendars: Ref<Calendar[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const calendar: Ref<string> = ref("");
const { authResult, acquireToken } = useMsalAuthentication();

async function getCalendars() {
    if (authResult.value) {
        const graphData = await queryMsGraph("calendars", {}, authResult.value.accessToken).catch(() => acquireToken());
        calendars.value = graphData.value;
        loading.value = true;
    }
}

function storeCalendar(value: string) {
    setCalendarId(value);
}

const calendarOptions = computed(() => {
    return calendars.value.map((calendar) => {
        return { label: calendar.name, value: calendar.id };
    });
});

onMounted(() => {
    calendar.value = getCalendarId();
    getCalendars();
});

watch(authResult, () => {
    getCalendars();
});
</script>

<template>
    <Page title="Einstellungen">
        <Section class="flex justify-between items-center p-4 bg-white">
            <div>
                Du bist angemeldet als
                <strong>{{ account.name }}: {{ account.email }}</strong>
            </div>
            <SignOutButton
                class="inline-flex items-center font-medium leading-5 text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:ring-2 px-3 md:px-5 py-3 bg-blue-600 active:bg-blue-600 hover:bg-blue-700 ring-blue-700 flex items-center"
            />
        </Section>

        <Section class="items-center p-4 bg-white">
            <h2 class="text-lg font-bold mb-4">Kalender auswählen</h2>

            <SelectField
                v-model:value="calendar"
                @update:value="storeCalendar"
                :options="calendarOptions"
                label="Bitte Kalender auswählen"
                name="calendar"
            />
        </Section>
    </Page>
</template>
