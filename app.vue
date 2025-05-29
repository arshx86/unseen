<template>
  <AExtractStyle>
    <div class="min-h-screen flex flex-col">
      <AConfigProvider :theme="getToken">
        <NuxtLoadingIndicator color="white" />
        <main class="flex flex-grow items-center justify-center px-4">
          <NuxtPage />
        </main>
      </AConfigProvider>
    </div>
  </AExtractStyle>
</template>

<script setup lang="ts">
  import { theme } from "ant-design-vue";
  import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";
  const color = useColorMode();

  const getTheme = computed(() => {
    return color.value === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm;
  });

  const getToken = computed((): ThemeConfig => {
    const isDark = color.value === "dark";
    return {
      algorithm: getTheme.value,
      token: {
        size: 22,
        borderRadius: 8,
        colorPrimary: "#3b4fd8",
        colorBgContainer: isDark ? "#0a0c17" : "#ffffff", // ChAnged wh
        colorBorder: isDark ? "#1e2235" : "#e2e8f0", // Li
        colorText: isDark ? "#e6e7f0" : "#1e293b", // D
        colorTextSecondary: isDark ? "#9499b3" : "#64748b",
        colorBgElevated: isDark ? "#0a0c17" : "#ffffff",
        colorBgSpotlight: isDark ? "#3b4fd8" : "#3b4fd8",
        colorLink: isDark ? "#3b4fd8" : "#3b4fd8",
        colorLinkHover: isDark ? "#5468e7" : "#2d3eb3",
        colorFillSecondary: isDark ? "#1a1e33" : "#f1f5f9", // light ac
        colorFillTertiary: isDark ? "#1a2333" : "#f8fafc", //
        colorFill: isDark ? "#1a1e33" : "#f8fafc", //
        colorBgLayout: isDark ? "#0a0c17" : "#ffffff",
        colorTextLightSolid: "#FFFFFF",
        colorPrimaryHover: isDark ? "#5468e7" : "#2d3eb3",
        colorPrimaryActive: isDark ? "#6b7eeb" : "#1f2c8f",
        colorError: "#801919",
        colorErrorBg: isDark ? "#801919" : "#801919",
        colorErrorBgHover: isDark ? "#a62020" : "#a62020",
        colorErrorText: isDark ? "#e6e7f0" : "#e6e7f0",
      },
    };
  });
</script>
