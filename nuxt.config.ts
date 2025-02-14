// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    // Public keys that are exposed to the client
    public: {
      gcpKey: process.env.GCP_KEY,
      apiBase: "https://hasebetest2.g.kuroco.app",
      staticToken: process.env.NUXT_STATIC_TOKEN,
      publicApiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
  modules: ["@pinia/nuxt"],
});
