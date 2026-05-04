import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./projects/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",

        line: "var(--line)",
        "line-2": "var(--line-2)",
        "line-3": "var(--line-3)",

        "mute-3": "var(--mute-3)",
        "mute-2": "var(--mute-2)",
        mute: "var(--mute)",
        "ink-2": "var(--ink-2)",
        ink: "var(--ink)",

        accent: "var(--accent)",
        "accent-on": "var(--accent-on)",
        "accent-dim": "var(--accent-dim)",

        warn: "var(--warn)",
        ok: "var(--ok)",
      },
      boxShadow: {
        glow: "0 0 24px var(--accent-glow)",
        "glow-soft": "0 0 16px var(--accent-glow-soft)",
        sm: "0 1px 2px rgba(0,0,0,.4)",
        md: "0 4px 12px rgba(0,0,0,.5)",
        lg: "0 12px 32px rgba(0,0,0,.6)",
      },
      borderRadius: {
        "sq-xs": "var(--r-square-xs)",
        sq: "var(--r-square)",
        "sq-md": "var(--r-square-md)",
        "sq-lg": "var(--r-square-lg)",
        "sq-xl": "var(--r-square-xl)",
        "sq-xxl": "var(--r-square-xxl)",
        round: "var(--r-round)",
      },
      fontFamily: {
        display: "var(--f-display)",
        body: "var(--f-body)",
        mono: "var(--f-mono)",
      },
      transitionDuration: {
        DEFAULT: "240ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(.2,.6,.2,1)",
        press: "cubic-bezier(.4,0,.6,1)",
      },
    },
  },
  plugins: [],
};

export default config;
