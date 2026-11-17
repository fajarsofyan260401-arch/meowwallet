/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF9F4",
        "pastel-blue": "#DCEFFA",
        "soft-pink": "#F8DDE3",
        "mint-green": "#DDEEDC",
        "butter-yellow": "#FFF0C9",
        "dark-brown": "#51443F",
        "soft-gray": "#F2EFED",
      },
      borderRadius: {
        card: "22px",
      },
      boxShadow: {
        kawaii: "0 10px 25px -5px rgba(81, 68, 63, 0.06), 0 4px 10px -3px rgba(81, 68, 63, 0.04)",
      },
    },
  },
  plugins: [],
};