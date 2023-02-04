<script setup lang="ts">
import Navbar from "./blocks/Navbar.vue";
import Dashboard from "./pages/Dashboard.vue";
import Subjects from "./pages/Subjects.vue";
import Statistics from "./pages/Statistics.vue";
import Settings from "./pages/Settings.vue";
import NotFound from "./pages/404.vue";

const active: { url: String; component: any } = [
    { url: "/", component: Dashboard },
    { url: "/subjects", component: Subjects },
    { url: "/statistics", component: Statistics },
    { url: "/settings", component: Settings },
].find((entry) => entry.url === window.location.pathname) || {
    url: "*",
    component: NotFound,
};
</script>

<template>
    <div class="flex flex-col flex-1 w-full">
        <header>
            <Navbar />
        </header>
        <main class="h-full overflow-y-auto">
            <component :is="active.component" />
        </main>
    </div>
</template>
