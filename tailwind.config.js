/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "corporate",
      "emerald",
      "synthwave",
      "retro",
      "cyberpunk",
    ],
  },
  plugins: [require("daisyui")],
};
