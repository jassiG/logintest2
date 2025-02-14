<template>
  <div>
    <button type="button" @click="logout">Logout</button>
    <div v-for="n in response.list" :key="n.slug">
      <nuxt-link :to="'/news/' + n.slug">
        {{ n.ymd }} {{ n.subject }}
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "~/stores/authentication";

definePageMeta({
  middleware: ["auth"],
});

const config = useRuntimeConfig();
const { data: response } = await useFetch("/rcms-api/1/news", {
  baseURL: config.public.apiBase,
  credentials: "include",
});

const store = useStore();
const logout = () => store.logout();
</script>
