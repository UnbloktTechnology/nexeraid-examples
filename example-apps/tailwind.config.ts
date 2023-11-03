import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'red-sygnum': '#df2a4f',
      },
    },
  },
  plugins: [],
} satisfies Config;
