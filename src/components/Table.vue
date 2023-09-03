<script setup lang="ts">
import Spinner from "./Spinner.vue";

export interface Props {
    fields: Array<Field>;
    values: Array<{ [name: string]: any }>;
    emptyText?: string;
    loading?: boolean;
}

export interface Field {
    id: string;
    label: string;
    nowrap?: boolean;
}

const { fields } = withDefaults(defineProps<Props>(), { emptyText: "Keine Einträge gefunden", loading: false });
</script>

<template>
    <div class="w-full overflow-x-auto border-t">
        <table class="w-full whitespace-no-wrap">
            <thead>
                <tr class="text-xs font-bold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                    <th v-for="field in fields" class="px-4 py-3" v-text="field.label" />
                </tr>
            </thead>
            <tbody class="bg-white divide-y">
                <template v-if="loading">
                    <tr class="text-gray-700">
                        <td class="text-center px-4 py-8" colspan="9999">
                            <Spinner />
                        </td>
                    </tr>
                </template>
                <template v-else-if="values.length > 0">
                    <tr v-for="(row, index) in values" class="text-gray-700">
                        <td v-for="field in fields" :class="['px-4 py-6', field.nowrap ? 'whitespace-nowrap' : '']">
                            <slot :name="`cell(${field.id})`" :entry="row" :field="field" :index="index">
                                {{ row[field.id] }}
                            </slot>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr class="text-gray-700">
                        <td class="text-center px-4 py-8" colspan="9999" v-text="emptyText" />
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>
