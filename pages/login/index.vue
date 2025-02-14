<template>
  <form @submit.prevent="login">
    <p v-if="loginStatus !== null" :style="{ color: resultMessageColor }">
      {{ resultMessage }}
    </p>

    <input v-model="email" name="email" type="email" placeholder="email" />
    <input
      v-model="password"
      name="password"
      type="password"
      placeholder="password"
    />
    <button type="submit">Login</button>

    <div>
      <nuxt-link to="/news"> news list </nuxt-link>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "~/stores/authentication";
const store = useStore();
const config = useRuntimeConfig();

const email = ref("");
const password = ref("");
const loginStatus = ref(null);
const resultMessage = ref(null);

const resultMessageColor = computed(() => {
  switch (loginStatus.value) {
    case "success":
      return "green";
    case "failure":
      return "red";
    default:
      return "";
  }
});

async function login() {
  try {
    const payload = {
      email: email.value,
      password: password.value,
    };
    await store.login(payload);

    loginStatus.value = "success";
    resultMessage.value = "Login successful";
  } catch (e) {
    loginStatus.value = "failure";
    resultMessage.value = "Login failed";
  }
}
</script>
