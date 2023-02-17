<script setup lang="ts">
export interface Props {
    fields: Array<Field>;
    values: Array<{ [name: string]: any }>;
    emptyText?: string;
}

export interface Field {
    id: string;
    label: string;
}

const { fields } = withDefaults(defineProps<Props>(), { emptyText: "Keine Einträge gefunden" });
</script>

<template>
    <div class="w-full overflow-x-auto">
        <table class="w-full whitespace-no-wrap">
            <thead>
                <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                    <th v-for="field in fields" class="px-4 py-3" v-text="field.label" />
                </tr>
            </thead>
            <tbody class="bg-white divide-y">
                <template v-if="values.length > 0">
                    <tr v-for="(row, index) in values" class="text-gray-700">
                        <td v-for="field in fields" class="px-4 py-6">
                            <slot :name="`cell(${field.id})`" :entry="row" :field="field" :index="index">{{
                                row[field.id]
                            }}</slot>
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
