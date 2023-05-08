/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,mjs}", "./resources/**/*.{html,js,mjs}"],
  theme: {
    screens: {
      'media-500': '500px',
      'media-600': '600px',
      'media-640': '640px',
      'media-768': '768px',
      'media-800': '800px',
      'media-1080': '1080px'
    },
    extend: {
      backgroundImage: {
        'img-pag-principal': "url(../images/31173-aviones.jpg)",
        'img-log-in': "url(../images/ali-abdul-rahman-JOgQUlO6JXU-unsplash.webp)",
        'img-admin': "url(../images/WY34ETTE4FEPHDRVFUB6AZCYVU.jpg)",
        'img-aux': "url(../images/airplane-taking-off-at-dawn-wallpaper-2560x1080_14.jpg)",
        'img-customer': "url(../images/31172.webp)"
      },
      fontSize: {
        'size-xl': 'x-large',
        'medium' : 'medium'
      },
      backgroundColor: {
        'white-1': 'rgb(250, 248, 241)',
        'orange-1': 'rgb(255, 244, 207)',
        'orange-2': 'rgb(255, 211, 132)',
        'orange-3': 'rgb(255, 166, 0)'
      },
      margin: {
        'left-45%': '0 5% 0 45%',
        'top': '40vh 0 0 0',
        'top-2': '45vh 0 0 0',
        'margin3': '100px 35px 50px 0'
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: true,
    base: false,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "light",
  },
}

