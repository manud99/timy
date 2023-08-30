<script setup lang="ts">
import { Ref, computed, provide, ref } from "vue";
import Navbar from "./blocks/Navbar.vue";
import Dashboard from "./pages/Dashboard.vue";
import Subjects from "./pages/Subjects.vue";
import Statistics from "./pages/Statistics.vue";
import Settings from "./pages/Settings.vue";
import NotFound from "./pages/404.vue";
import { locationKey, baseUrlKey } from "./keys";
import LoginModal from "./modals/LoginModal.vue";
import { showLoginModal } from "./google/plugin";

interface ComponentOption {
    url: String;
    component: any;
}

let baseUrl = import.meta.env.BASE_URL;
if (!baseUrl.endsWith("/")) baseUrl += "/";
provide(baseUrlKey, baseUrl);
console.log(baseUrl);


const options = [
    { url: baseUrl, component: Dashboard },
    { url: baseUrl + "subjects", component: Subjects },
    { url: baseUrl + "statistics", component: Statistics },
    { url: baseUrl + "settings", component: Settings },
];

const active = computed(() => {
    const option = options.find((entry) => entry.url === location.value);
    if (option) return option;
    else return { url: "*", component: NotFound };
});

const location = ref<string>(window.location.pathname);
provide(locationKey, location);
window.addEventListener("popstate", (event) => {
    location.value = window.location.pathname;
});
</script>

<template>
    <div class="flex flex-col flex-1 w-full">
        <Navbar />
        <main class="h-full overflow-y-auto">
            <component :is="active.component" />
        </main>
    </div>

    <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
</template>
