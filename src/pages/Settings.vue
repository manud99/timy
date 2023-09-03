<script setup lang="ts">
import { Ref, ref, inject, onMounted, watch } from "vue";
import Page from "../blocks/Page.vue";
import Button, { ButtonSize } from "../components/Button.vue";
import Section from "../blocks/Section.vue";
import SelectField, { Option } from "../components/SelectField.vue";
import { getCalendarId, setCalendarId } from "../utils/settings";
import { googleReadyKey } from "../keys";
import { fetchCalendars, fetchUserInfo } from "../google/query";
import { signOut } from "../google/utils";

const calendars: Ref<Option[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const calendar: Ref<string> = ref("");
const account: Ref<any> = ref(null);
const ready = inject<Ref<boolean>>(googleReadyKey);

async function getCalendars() {
    if (!ready || !ready.value) return;

    const res = await fetchCalendars();
    calendars.value = res.map((calendar: any) => {
        return { label: calendar.summary, value: calendar.id };
    });
}

async function getUserInfo() {
    if (!ready || !ready.value) return;

    const res = await fetchUserInfo();
    account.value = res;
}

function storeCalendar(value: string) {
    setCalendarId(value);
}

onMounted(() => {
    calendar.value = getCalendarId() || "";
    getCalendars();
    getUserInfo();
});

if (ready) {
    const stopWatcher = watch(ready, () => {
        getCalendars();
        getUserInfo();
    });
}
</script>

<template>
    <Page title="Einstellungen">
        <div class="grid lg:grid-cols-2 gap-6">
            <Section class="flex flex-col mx-auto p-4 bg-white">
                <h2 class="text-lg font-bold mb-4">Account Informationen</h2>
                <p class="flex-1 mb-2">
                    Du bist angemeldet als
                    <strong v-if="account">
                        {{ account.names[0].displayName }}
                        ({{ account.emailAddresses[0].value }})
                    </strong>
                </p>
                <div><Button :size="ButtonSize.LG" label="Abmelden" @click="signOut" /></div>
            </Section>
            <Section class="items-center p-4 bg-white mx-auto">
                <h2 class="text-lg font-bold mb-4">Kalender auswählen</h2>
                <p class="mb-2">
                    Bitte wähle einen Google-Kalender aus, der deinem Account gehört. Mit diesem Kalender werden deine
                    Zeiteinträge synchronisiert. Es kann ein neuer oder auch ein bestehender Kalender sein.
                </p>
                <SelectField
                    v-model:value="calendar"
                    @update:value="storeCalendar"
                    :options="calendars"
                    label="Bitte Kalender auswählen"
                    name="calendar"
                />
            </Section>
        </div>
    </Page>
</template>
