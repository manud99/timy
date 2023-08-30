<script setup lang="ts">
import InternalLink from "../components/InternalLink.vue";
import { baseUrlKey, locationKey } from "../keys";
import { inject } from "vue";
import type { Ref } from "vue";
import { signIn } from "../google/utils";

const location = inject<Ref<string>>(locationKey);

// const isAuthenticated = getIsAuthenticated();
const isAuthenticated = false;

function isActive(href: string) {
    return location?.value === href;
}

const baseUrl = inject(baseUrlKey) || "/";
</script>

<template>
    <header class="z-10 py-2 bg-white shadow-md">
        <nav class="container grid grid-cols-3 items-center h-full px-4 mx-auto">
            <div><a class="text-xl font-bold text-gray-800 px-2 py-1" :href="baseUrl"> TIMY </a></div>
            <ul class="flex justify-center">
                <li
                    class="px-2 mx-4"
                    v-for="page in [
                        { url: '', label: 'Dashboard' },
                        { url: 'subjects', label: 'Fächer' },
                        { url: 'statistics', label: 'Statistik' },
                    ]"
                >
                    <InternalLink
                        class="font-semibold text-gray-600 transition-colors duration-150 hover:text-blue-700 px-2 py-1"
                        :class="isActive(page.url) ? 'text-blue-700 border-b-2 border-blue-700' : ''"
                        :page="page.url"
                        v-text="page.label"
                    />
                </li>
            </ul>
            <ul class="flex justify-end items-center">
                <li class="px-2 ml-4" v-for="page in [{ url: 'settings', label: 'Einstellungen' }]">
                    <InternalLink
                        class="font-semibold text-gray-600 transition-colors duration-150 hover:text-blue-700 px-2 py-1"
                        :class="isActive(page.url) ? 'text-blue-700 border-b-2 border-blue-700' : ''"
                        :page="page.url"
                        v-text="page.label"
                    />
                </li>
            </ul>
        </nav>
    </header>
</template>
