import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {

      fontFamily: {
        mono: [ "var(--font-geist-mono)" ],
        sans: [ "var(--font-geist-sans)" ],
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        borders: "var(--borders)",
        "text-gray-300": "var(--text-gray-300)",
        "text-gray-400": "var(--text-gray-400)",
        "text-gray-600": "var(--text-gray-600)",
        "text-gray-700": "var(--text-gray-700)",
        "text-gray-800": "var(--text-gray-800)",
        white: "var(--white)",
        black: "var(--black)",
        "selection-background": "var(--selection-background)",
        accent: {
          primary: "var(--accent-primary)",
          secondary: "var(--accent-secondary)",
          hover: "var(--accent-hover)",
        },
        syntax: {
          keyword: "var(--syntax-keyword)",
          function: "var(--syntax-function)",
          comment: "var(--syntax-comment)",
          number: "var(--syntax-number)",
          string: "var(--syntax-string)",
        },
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        success: "var(--success)",
      },
      borderRadius: {
        "mdd": "var(--border-radius)",
      },
    },

  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
