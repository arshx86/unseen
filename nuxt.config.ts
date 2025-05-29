// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  pages: true,
  app: {
    head: {
      title: "unseen",
      meta: [
        {
          name: "description",
          content: "unseen is a End-to-end encrypted pastebin alternative",
        },
      ],
    },
  },
  modules: [
    "nuxt-mongoose",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@ant-design-vue/nuxt",
    "@nuxt/fonts",
    "@nuxt/icon",
  ],
  antd: {
    //extractStyle: true,
  },
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },
  mongoose: {
    uri: process.env.MONGODB_URI,
  },
  css: ["@/assets/css/tailwind.css", "@/assets/css/main.css"],
});
