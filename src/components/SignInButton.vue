<script lang="ts" setup>
import { useMsal } from "../microsoft/useMsal";
import { loginRequest } from "../microsoft/auth";

const { instance } = useMsal();

const signIn = () => {
    instance.loginPopup(loginRequest);
};
</script>

<template>
    <button @click="signIn">Sign In</button>
</template>
