<script setup lang="ts">
import { Ref, computed, provide, ref } from "vue";
import Navbar from "./blocks/Navbar.vue";
import Dashboard from "./pages/Dashboard.vue";
import Subjects from "./pages/Subjects.vue";
import Statistics from "./pages/Statistics.vue";
import Settings from "./pages/Settings.vue";
import NotFound from "./pages/404.vue";
import LoginModal from "./modals/LoginModal.vue";
import { showLoginModal } from "./google/plugin";
import { baseUrl, location } from "./utils/routing";

interface ComponentOption {
    url: string;
    component: any;
}

const options: ComponentOption[] = [
    { url: baseUrl.value, component: Dashboard },
    { url: baseUrl.value + "subjects", component: Subjects },
    { url: baseUrl.value + "statistics", component: Statistics },
    { url: baseUrl.value + "settings", component: Settings },
];

const active = computed(() => {
    const option = options.find((entry) => entry.url === location.value);
    if (option) return option;
    else return { url: "*", component: NotFound };
});
</script>

<template>
    <div class="flex flex-col flex-1 w-full">
        <Navbar />
        <main class="h-full overflow-y-auto pb-10">
            <component :is="active.component" />
        </main>
    </div>

    <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
</template>
