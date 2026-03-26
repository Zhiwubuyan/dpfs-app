/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            // 这里可以自定义你的高级感配色
            colors: {
                'regal-blue': '#243c5a',
            },
        },
    },
    plugins: [],
}