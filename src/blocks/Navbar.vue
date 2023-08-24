<script setup lang="ts">
import InternalLink from "../components/InternalLink.vue";
import SignInButton from "../components/SignInButton.vue";
import SignOutButton from "../components/SignOutButton.vue";
import { locationKey } from "../keys";
import { inject } from "vue";
import type { Ref } from "vue";

const location = inject<Ref<string>>(locationKey);

// const isAuthenticated = getIsAuthenticated();
const isAuthenticated = false;

function isActive(href: string) {
    return location?.value === href;
}
</script>

<template>
    <header class="z-10 py-4 bg-white shadow-md">
        <nav class="container grid grid-cols-3 items-center h-full px-4 mx-auto">
            <div><a class="text-xl font-bold text-gray-800 px-2 py-1" href="/"> TIMY </a></div>
            <ul class="flex justify-center">
                <li
                    class="px-2 mx-4"
                    v-for="page in [
                        { url: '/', label: 'Dashboard' },
                        { url: '/subjects', label: 'Fächer' },
                        { url: '/statistics', label: 'Statistik' },
                    ]"
                >
                    <InternalLink
                        class="font-semibold text-gray-600 transition-colors duration-150 hover:text-blue-700 px-2 py-1"
                        :class="isActive(page.url) ? 'text-blue-700 border-b-2 border-blue-700' : ''"
                        :href="page.url"
                        v-text="page.label"
                    />
                </li>
            </ul>
            <ul class="flex justify-end items-center">
                <li class="px-2 ml-4" v-for="page in [{ url: '/settings', label: 'Einstellungen' }]">
                    <InternalLink
                        class="font-semibold text-gray-600 transition-colors duration-150 hover:text-blue-700 px-2 py-1"
                        :class="isActive(page.url) ? 'text-blue-700 border-b-2 border-blue-700' : ''"
                        :href="page.url"
                        v-text="page.label"
                    />
                </li>
                <li class="px-2 ml-4">
                    <SignInButton
                        class="font-semibold text-gray-600 transition-colors duration-150 hover:text-blue-700 px-4 py-1"
                    />
                </li>
            </ul>
        </nav>
    </header>
</template>
