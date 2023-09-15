<script setup lang="ts">
import { Subject, TimeEntry } from "../@types/models";
import { getFullDate, getTime, isOnSameDay } from "../utils/date";
import Button, { ButtonSize } from "./Button.vue";
import IconGarbage from "../icons/Garbage.vue";
import IconPencil from "../icons/Pencil.vue";
import SubjectTag from "../blocks/SubjectTag.vue";
import Spinner from "./Spinner.vue";

const props = defineProps<{
    loading: boolean;
    timeEntries: TimeEntry[];
}>();

const emit = defineEmits<{
    (e: "edit", timeEntry: TimeEntry): void;
    (e: "delete", timeEntry: TimeEntry): void;
    (e: "editSubject", subject: Subject): void;
}>();

let lastDate: string | null = null;
function isFirstEntryOfTheDay(value: string) {
    const res = lastDate === null || !isOnSameDay(lastDate, value);
    lastDate = value;
    return res;
}
</script>

<template>
    <div class="md:hidden border-t">
        <template v-if="!loading">
            <div v-for="entry in timeEntries">
                <div
                    v-if="isFirstEntryOfTheDay(entry.start)"
                    class="text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50 p-2"
                    v-text="getFullDate(entry.start)"
                />
                <div class="bg-white border-b px-2 py-4">
                    <div class="flex justify-between mb-2">
                        <SubjectTag
                            v-if="entry.subject"
                            class="cursor-pointer"
                            :subject="entry.subject"
                            @dblclick="emit('editSubject', entry.subject)"
                        />
                        <div class="flex">
                            <Button
                                class="mr-2"
                                :size="ButtonSize.SM"
                                label="Bearbeiten"
                                @click="emit('edit', entry as TimeEntry)"
                            >
                                <IconPencil class="lg:mr-2" :size="16" />
                                <span class="hidden lg:inline">Bearbeiten</span>
                            </Button>
                            <Button :size="ButtonSize.SM" label="Löschen" @click="emit('delete', entry as TimeEntry)">
                                <IconGarbage class="lg:mr-2" :size="12" />
                                <span class="hidden lg:inline">Löschen</span>
                            </Button>
                        </div>
                    </div>
                    <div class="flex items-baseline gap-2">
                        <span class="min-w-[110px] whitespace-nowrap">
                            {{ getTime(entry.start) }} &#x2013; {{ getTime(entry.end) }}
                        </span>
                        <span class="font-semibold" v-text="entry.description" />
                    </div>
                </div>
            </div>
        </template>
        <div v-else class="bg-white text-center px-4 py-8" colspan="9999">
            <Spinner />
        </div>
    </div>
</template>
