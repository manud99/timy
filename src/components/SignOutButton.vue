<script lang="ts" setup>
import { useMsal } from "../microsoft/utils";

const { instance } = useMsal();

const signIn = async () => {
    instance.logoutPopup();
};
</script>

<template>
    <button @click="signIn">Abmelden</button>
</template>
