<script setup>
import { onMounted } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
const router = useRouter();

onMounted(() => {
  router.push("/");
});
</script>

<template>
  <RouterView />
</template>
