/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    200: '#bae0fd',
                    300: '#7cc8fc',
                    400: '#36aef8',
                    500: '#0c92e7',
                    600: '#0274c7',
                    700: '#035ca2',
                    800: '#074e85',
                    900: '#0c416e',
                    950: '#082949',
                },
                society: {
                    emerald: '#10b981',
                    amber: '#f59e0b',
                    rose: '#f43f5e',
                    indigo: '#6366f1',
                    violet: '#8b5cf6',
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
