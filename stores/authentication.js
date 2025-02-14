import { defineStore } from "pinia";

export const useStore = defineStore("authentication", {
  state: () => ({
    profile: null,
    access_token: "",
  }),
  actions: {
    setProfile(profile) {
      this.profile = profile;
    },
    updateLocalStorage(payload) {
      Object.entries(payload).forEach(([key, val]) => {
        if (val === null || val === false) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(val));
        }
      });
    },
    setAccessTokenOnRequestHeader({ rcmsApiAccessToken }) {
      this.access_token = rcmsApiAccessToken;
    },
    async login(payload) {
      // const { grant_token } = await $fetch("/rcms-api/13/login", {
      //   method: "POST",
      //   baseURL: useRuntimeConfig().public.apiBase,
      //   credentials: "include",
      //   body: payload,
      // });
      // const { access_token } = await $fetch("/rcms-api/13/token", {
      //   method: "POST",
      //   baseURL: useRuntimeConfig().public.apiBase,
      //   credentials: "include",
      //   body: { grant_token: grant_token },
      // });

      // this.updateLocalStorage({ rcmsApiAccessToken: access_token.value });
      // this.setAccessTokenOnRequestHeader({
      //   rcmsApiAccessToken: access_token.value,
      // });

      // this.setProfile({}); // Apply the dummy object to store.state.profile
      // dummy request(succeed/fail after 1 sec.)
      const shouldSuccess = true;
      const request = new Promise((resolve, reject) =>
        setTimeout(
          () => (shouldSuccess ? resolve() : reject(Error("login failure"))),
          1000
        )
      );
      await request;

      this.setProfile({}); // Apply the dummy object to store.state.profile
      this.updateLocalStorage({ authenticated: true });
    },
    async logout() {
      try {
        await $fetch("/rcms-api/13/logout", {
          method: "POST",
          baseURL: useRuntimeConfig().public.apiBase,
          credentials: "include",
        });
      } catch {
        /** No Process */
        /** When it returns errors, it consider that logout is complete and ignore this process. */
      }
      this.setProfile(null);
      this.updateLocalStorage({ authenticated: false });
      navigateTo("/login");
    },
    async restoreLoginState() {
      const authenticated = localStorage.getItem("authenticated");
      const isAuthenticated = authenticated ? JSON.parse(authenticated) : false;

      if (!isAuthenticated) {
        await this.logout();
        throw new Error("need to login");
      }
      try {
        const profileRes = await $fetch("/rcms-api/13/profile", {
          baseURL: useRuntimeConfig().public.apiBase,
          credentials: "include",
        });
        this.setProfile(profileRes);
      } catch {
        await this.logout();
        throw new Error("need to login");
      }
    },
  },
  getters: {
    authenticated: (state) => state.profile !== null,
    token: (state) => state.access_token,
  },
});
