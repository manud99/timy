/** @type {import('tailwindcss').Config} */
module.exports = {
    customForms: (theme) => ({
        default: {
            "input, textarea": {
                "&::placeholder": {
                    color: theme("colors.gray.400"),
                },
            },
        },
    }),
    content: ["./index.html", "./src/**/*.{vue,js,ts}"],
    theme: {
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1240px",
        },
        extend: {},
    },
    plugins: [require("@tailwindcss/forms")],
};
