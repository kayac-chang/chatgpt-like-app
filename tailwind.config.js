const color = (name, alpha) => `rgb(var(${name}) / ${alpha})`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,md,mdx}"],
  theme: {
    extend: {
      container: {
        center: true,
      },
      colors: {
        background: color("--background", "<alpha-value>"),
        text: {
          DEFAULT: color("--text", "<alpha-value>"),
          invert: color("--text-invert", "<alpha-value>"),
        },
        primary: {
          dark: color("--primary-dark", "<alpha-value>"),
          normal: color("--primary-normal", "<alpha-value>"),
          light: color("--primary-light", "<alpha-value>"),
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "currentColor",
            "--tw-prose-quotes": "currentColor",
            "--tw-prose-quote-borders": color("--primary-light", 100),
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    //
  ],
};
