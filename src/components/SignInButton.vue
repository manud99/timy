<script lang="ts" setup>
import { useMsal } from "../microsoft/useMsal";
import { loginRequest } from "../microsoft/auth";

const { instance } = useMsal();

const signIn = async () => {
    instance.loginPopup(loginRequest);
};
</script>

<template>
    <button @click="signIn">Anmelden</button>
</template>
