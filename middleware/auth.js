import { useStore } from "@/stores/authentication";

export default defineNuxtRouteMiddleware(async () => {
  const store = useStore();

  if (!store.authenticated) {
    try {
      await store.restoreLoginState();
    } catch (err) {
      return navigateTo("/login");
    }
  }
});
