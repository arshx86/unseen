const { fontFamily } = require("tailwindcss/defaultTheme");

/**@type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [`Inter, ${fontFamily.sans.join(", ")}`],
        mono: ["'JetBrains Mono'", ...fontFamily.mono],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
