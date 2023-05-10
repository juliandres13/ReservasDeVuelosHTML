'use strict'

import { DateTime, Duration } from "../../node_modules/luxon/build/es6/luxon.js";
import { TabulatorFull as Tabulator } from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.min.js';
import Helpers from "./helpers.js";
import Modal from "./modal.js";
import icons from "./icons.js";

export default (async () => init())()

let user = {}

async function init() {

    window.DateTime = DateTime
    window.Duration = Duration
    window.Helpers = Helpers
    window.Tabulator = Tabulator
    window.Modal = Modal
    window.Icons = icons

    const config = await Helpers.fetchData("./resources/assets/config.json")
    localStorage.setItem("url", config.url)

    Helpers.scrollNav()
    
    if (localStorage.getItem("user") != null) {
        user = JSON.parse(localStorage.getItem("user"))
        Helpers.loadUserPage({ data: { user } }, init)
    } else {
        await main();
    }

}
async function main() {

    document.querySelector('.navegacion').innerHTML = `
        <nav class="nav hidden media-1080:flex items-center justify-center flex-shrink basis-auto">
            <a href="" class="search hover:text-white"><i class="fa-solid fa-magnifying-glass"></i> buscar</a>
            <a href="" class="destinations hover:text-white"><i class="fa-solid fa-earth-americas"></i> destinos</a>
            <a href="" class="help hover:text-white"><i class="fa-solid fa-circle-info"></i> ayuda</a>
        </nav>
        <nav class="desktop hidden media-1080:flex flex-auto justify-end pr-12 items-center">
            <a href="" class="sign-up hover:text-white text-medium pr-2.5">registrate</a>
            <a class="log-in-js p-2.5 bg-white-1 rounded-md hover:text-white cursor-pointer hover:bg-gray-500"><i class="fa-solid fa-user"></i> iniciar sesión</a>
        </nav>
        <nav class="laptop flex flex-auto justify-end items-center pr-6 h-20 w-1/2 media-1080:hidden">
            <i class="search fa-solid fa-magnifying-glass hover:text-white"><a href=""></a></i>
            <i class="destinations hidden media-600:flex fa-solid fa-earth-americas hover:text-white"><a href=""></a></i>
            <i class="sign-up hidden media-600:flex fa-solid fa-address-card hover:text-white"><a href=""></a></i>
            <i class="log-in-js hidden media-600:flex fa-solid fa-user text-white hover:text-orange-500" id="style-login"><a href=""></a></i>
            <i class="help hidden media-600:flex fa-solid fa-circle-info hover:text-white"><a href=""></a></i>
            <label class="btn swap swap-rotate bg-transparent hover:bg-transparent border-none pl-4 pr-0  media-600:hidden">
                <input type="checkbox" id="bars" />
                <svg class="swap-off" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
                <svg class="swap-on" xmlns="http://www.w3.org/2500/svg" width="25" height="25" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
            </label>                            
        </nav>
    `

    document.querySelector('.icons').innerHTML = `
        <a href="" class="destinations hover:text-white"><i class="fa-solid fa-earth-americas"></i> destinos</a>
        <a href="" class="sign-up hover:text-white"><i class="fa-solid fa-address-card"></i> registrarse</a>
        <a href="" class="log-in-js p-2.5 bg-white-1 rounded-md hover:text-white hover:bg-gray-500"><i class="fa-solid fa-user"></i> iniciar sesión</a>
        <a href="" class="help hover:text-white"><i class="fa-solid fa-circle-info"></i> ayuda</a>
    `

    document.querySelector('.text-header').innerHTML = `
        <h2 class="margin-interno px-6 my-10 font-bold text-xl media-600:text-2xl media-1080:text-3xl media-1080:px-12" id="title-index">Prepárate para volar!</h2>
        <div class="texto-bienvenida margin-interno flex items-center px-6 media-1080:px-12">
            <h3 class="text-black text-center font-semibold  media-1080:text-xl" style="margin-top: 40vh;" id="p-index">En nuestra página de vuelos, ofrecemos una amplia selección de opciones de viaje aéreo de las principales aerolíneas del mundo, con tarifas competitivas y herramientas de búsqueda avanzadas.</h3>
        </div>
    `
    await Helpers.loadPage('./resources/html/content.html', 'main')

    const loginIcons = document.querySelector('.icons')
    const navBarToggle = document.querySelector('#bars')
    const listOptions = document.querySelectorAll('.search, .destinations, .help, .sign-up, .log-in-js')

    navBarToggle.addEventListener('click', () => {
        loginIcons.classList.toggle('flex')
        loginIcons.classList.toggle('hidden')
    })

    listOptions.forEach(ancla => {
        ancla.addEventListener('click', e => {
            e.preventDefault()
            mainMenu(e.target.classList[0])
        })
    })
}
/**
 * Carga las capas de la página principal del sitio según la selección, además carga dinamicamente la pagina de inicio sesion y registro
 * @param {*} option Clase ubicada en la 1ra posicion del elemento seleccionado
 */
async function mainMenu(option) {
    if (option == 'log-in-js' || option == 'sign-up') {
        
        let logInModal = new Modal({
            title: "Acceso / Registro",
            buttons: [{
                id: 'ok',
                style: 'form-button btn text-black bg-pink-600 hover:bg-black hover:text-pink-600',
                html: 'Ingresar'
            }],
            content: `${await Helpers.loadPage('./resources/html/logIn.html')}`
        }).show()

        document.getElementById('close').addEventListener('click', (e) => {
            e.preventDefault();
            logInModal.dispose()
        })
        
        const { default: InicioSesion } = await import(`./logIn.js`)
        new InicioSesion(option, logInModal, init)
        
    } else {
        switch (option) {
            case 'search':
                console.log('cargó');
                break;
            case 'destinations':
                Helpers.toggle('#title-index', '#p-index')
                await Helpers.loadPage('./resources/html/destinations.html', 'main');
                break;
            case 'help':
                Helpers.toggle('#title-index', '#p-index')
                await Helpers.loadPage("./resources/html/help.html", 'main')
                break;
        }
    }
}
