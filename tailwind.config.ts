import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Indian Government Colors
        gov: {
          saffron: "#FF9933",
          white: "#FFFFFF", 
          green: "#138808",
          navy: "#0B3D91",
          blue: "#0B5CAB",
          blueDark: "#084B8A",
          gold: "#C9A227",
          gray: "#F5F5F5",
          text: "#1B1B1B",
          darkGray: "#6B7280",
          lightBlue: "#EBF4FF",
        },
        // Additional government portal colors
        primary: {
          50: "#EBF4FF",
          100: "#DBEAFE", 
          500: "#0B3D91",
          600: "#084B8A",
          700: "#0B5CAB",
        },
        secondary: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          500: "#FF9933",
          600: "#EA580C",
        },
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          500: "#138808",
          600: "#16A34A",
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "1.5rem",
        },
        screens: {
          xl: "1200px",
          "2xl": "1400px",
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
