import { defineStore } from "pinia";

export const useStore = defineStore("authentication", {
  state: () => ({
    profile: null,
  }),
  actions: {
    setProfile(profile) {
      this.profile = profile;
    },
    updateLocalStorage(payload) {
      Object.entries(payload).forEach(([key, val]) => {
        localStorage.setItem(key, JSON.stringify(val));
      });
    },
    async logout() {
      this.setProfile(null);
      this.updateLocalStorage({ authenticated: false });
      navigateTo("/login");
    },
    async restoreLoginState() {
      const authenticated = JSON.parse(localStorage.getItem("authenticated"));

      if (!authenticated) {
        await this.logout();
        throw new Error("need to login");
      }
      try {
        this.setProfile({}); // Store the dummy object.
      } catch {
        await this.logout();
        throw new Error("need to login");
      }
    },
  },
  getters: {
    authenticated: (state) => state.profile !== null,
  },
});
