import { Ref, ref } from "vue";

let url = import.meta.env.BASE_URL;
if (!url.endsWith("/")) url += "/";
export const baseUrl: Ref<string> = ref(url);

export const location: Ref<string> = ref(window.location.pathname);

export function navigate(page: string) {
    const url = (baseUrl.value || "/") + page;
    window.history.pushState(null, "", url);
    location.value = url;
}

window.addEventListener("popstate", () => {
    location.value = window.location.pathname;
});
