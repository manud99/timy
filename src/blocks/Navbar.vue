<script setup lang="ts"></script>

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
                    <a
                        class="font-semibold transition-colors duration-150 hover:text-blue-800 px-2 py-1"
                        :href="page.url"
                        v-text="page.label"
                    />
                </li>
            </ul>
            <ul class="flex justify-end">
                <li class="px-2 mx-4" v-for="page in [{ url: '/settings', label: 'Einstellungen' }]">
                    <a
                        class="font-semibold transition-colors duration-150 hover:text-blue-800 px-2 py-1"
                        :href="page.url"
                        v-text="page.label"
                    />
                </li>
            </ul>
        </nav>
    </header>
</template>
