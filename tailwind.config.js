/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./landingpage.html", "./developement.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"], // Ajoutez vos chemins ici
  theme: {
    extend: {
      fontFamily: {
        title: ["Permanent Marker", 'sans-serif'],
        lucky: ["Luckiest Guy", 'sans-serif'],
      },
      colors: {
        purple: '#9E35C1',
        green: '#A3E447',
        darckblue: '#204248',
        lightblue: '#35B1B5',
        red: '#FF662F',
      },
      boxShadow: {
        'shadowred': '-15px -15px 0px 5px #FF662F',
        'shadowgreen': '-15px -15px 0px 5px #A3E447',
        'shadowblue': '-15px -15px 0px 5px #35B1B5',
      }

    },
  },
  plugins: [],
}