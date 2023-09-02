export function getQueryParam(key: string) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
}

export function updateQueryParam(key: string, value: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    window.history.replaceState(null, "", window.location.pathname + "?" + searchParams.toString());
}
