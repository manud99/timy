<script setup lang="ts">
import InternalLink from "../components/InternalLink.vue";
import { baseUrl, isActive } from "../utils/routing";
import { ready, showLoginModal } from "../google/plugin";
</script>

<template>
    <header class="z-10 py-2 bg-white shadow-md">
        <nav class="container flex grid grid-cols-2 md:grid-cols-3 items-center h-full px-4 mx-auto">
            <div class="inline-flex items-center">
                <a class="text-xl font-bold text-gray-800 px-2 py-1 mr-2" :href="baseUrl"> TIMY </a>
                
                <div v-if="ready" class="text-sm text-green-800 px-2 py-1">
                    <span class="inline-block bg-green-500 rounded-full w-2 h-2 align-middle" />
                    verbunden
                </div>
                <button v-else class="text-sm text-red-800 px-2 py-0.5 -my-0.5" type="button" title="Jetzt anmelden" @click="showLoginModal = true">    
                    <span class="inline-block bg-red-500 rounded-full w-2 h-2 align-middle" />
                    nicht verbunden
                </button>
            </div>
            <ul class="hidden md:flex justify-center">
                <li
                    class="px-2 md:mx-4"
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
    <footer class="fixed md:hidden bottom-0 inset-x-0 bg-white shadow-t-md z-10">
        <ul class="grid grid-cols-3 py-2">
            <li
                class="px-2 md:mx-4 text-center"
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
    </footer>
</template>
