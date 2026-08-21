/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf4",
          100: "#d7f9e3",
          200: "#b1f0cb",
          300: "#7de2ab",
          400: "#45cc86",
          500: "#20b56a",
          600: "#149255",
          700: "#127548",
          800: "#125d3c",
          900: "#104d33",
          950: "#062b1c",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#b1b9c8",
          400: "#8691a8",
          500: "#67728c",
          600: "#535c74",
          700: "#444b5f",
          800: "#3a3f50",
          900: "#1c1f29",
          950: "#101219",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
