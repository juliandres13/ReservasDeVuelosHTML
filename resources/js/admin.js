'use strict'

export default class Administrador {
    #data
    #callBack
    constructor(data, callBack) {
        this.#data = data
        this.#callBack = callBack
        document.querySelector('.navegacion').innerHTML = `
            <nav class="nav hidden media-1080:flex flex-shrink basis-auto justify-center items-center">
                <a href="" class="search hover:text-white"><i class="fa-solid fa-magnifying-glass"></i> buscar</a>
                <a href="" class="company hover:text-white"><i class="fa-solid fa-city"></i> compañía</a>
                <a href="" class="help hover:text-white"><i class="fa-solid fa-circle-info"></i> ayuda</a>
            </nav>
            <nav class="desktop hidden media-1080:flex flex-auto justify-end items-center media-1080:pr-12">
                <i class="account fa-solid fa-circle-user pr-2.5 text-size-xl hover:text-white"><a href=""></a></i>
                <i class="log-out fa-solid fa-arrow-right-from-bracket bg-white-1 p-2.5 rounded-lg hover:bg-gray-500 hover:text-white" title="Cerrar Sesión"><a href=""></a></i>
            </nav>
            <nav class="laptop flex media-1080:hidden flex-auto justify-end items-center w-1/2 h-20 pr-6">
                <i class="search fa-solid fa-magnifying-glass hover:text-white"><a href=""></a></i>
                <i class="company hidden media-600:flex fa-solid fa-city hover:text-white"><a href=""></a></i>
                <i class="account fa-solid fa-circle-user hover:text-white"></i></a>
                <i class="help hidden media-600:flex fa-solid fa-circle-info hover:text-white"><a href=""></a></i>
                <i class="log-out hidden media-600:flex fa-solid fa-arrow-right-from-bracket text-white hover:text-orange-500"></i>
                <i class="fa-solid fa-bars hover:text-white media-600:hidden" id="bars"><a href=""></a></i>
            </nav>
        `
        
        document.querySelector('.icons').innerHTML = `
            <a href="" class="company hover:text-white"><i class="fa-solid fa-city"></i> compañía</a>
            <a href="" class="account hover:text-white"><i class="fa-solid fa-circle-user"></i> cuenta</a>
            <a href="" class="help hover:text-white"><i class="fa-solid fa-circle-info"></i> ayuda</a>
            <a href="" class="log-out bg-white-1 rounded-md hover:bg-gray-500 hover:text-white">cerrar sesión <i class="fa-solid fa-arrow-right-from-bracket"></i></a>
        `
        document.querySelector('.text-header').innerHTML = `
            <h2 class="margin-interno text-xl media-600:text-2xl media-1080:text-3xl px-6 my-10 media-1080:px-12 font-bold" id="titulo-h2">Bienvenido ${this.#data.nombres}!</h2>
            <div class="texto-bienvenida margin-interno flex px-6 media-1080:px-12 items-center">
                <h3 class="text-black text-center font-semibold media-1080:text-xl" style="margin-top: 35vh;" id="p-admin">¡Bienvenido de nuevo a nuestra página! Nos alegra mucho verte por aquí de nuevo después de tanto tiempo. Esperamos que disfrutes explorando todas las novedades y mejoras que hemos agregado desde tu última visita. ¡Que tengas un buen día!</h3>
            </div>
        `
        const icons = document.querySelector('.icons')
        const navBarToggle = document.querySelector('#bars')
        const listOptions = document.querySelectorAll('.search, .company, .help, .account, .log-out')
        const options = document.querySelectorAll('.nav-middle > a')

        navBarToggle.addEventListener('click', () => {
            icons.classList.toggle('flex')
            icons.classList.toggle('hidden')
        })
    
        listOptions.forEach(ancla => {
            ancla.addEventListener('click', e => {
                e.preventDefault()
                this.#mainMenu(e.target.classList[0]);
            })
        })

        options.forEach(option => {
            option.addEventListener('click', e => {
                e.preventDefault()
                this.#options(e.target.text)
            })
        })
    }
    /**
     * Carga las capas HTML del administrador según la opcion seleccionada
     * @param {*} option Clase ubicada en la 1ra posicion del elemento seleccionado
     */
    async #mainMenu(option) {
        switch (option) {
            case 'search':
                console.log('cargó');
                break;
            case 'company':
                console.log("cargó");
                break;
            case 'help':
                Helpers.toggle('#titulo-h2', '#p-admin')
                await Helpers.loadPage("./resources/html/help.html", 'main')
                break;
            case 'log-out':
                localStorage.removeItem("user")
                Helpers.configPage('bg-img-admin', 'bg-img-pag-principal')
                this.#callBack()
                break;
            case 'account':
                console.log("cargó");
                break;
            default:
                break;
        }
    }
    async #options(option) {
        switch (option) {
            case 'Aviones':
                const { default: Aviones } = await import(`./aviones.js`)
                await Aviones.init()
                break;
            case 'Trayectos':
                const { default: Trayectos } = await import(`./trayectos.js`)
                await Trayectos.init()
                break;
            case 'Vuelos':
                const { default: Vuelos } = await import(`./vuelos.js`)
                await Vuelos.init()
                break;
            case 'Reservas':
                const { default: Reservas } = await import(`./reservas.js`)
                new Reservas()
                break;
            case 'Personal':
                const { default: Personal } = await import(`./personal.js`)
                await Personal.init()
                break;
            default:
                break;
        }
    }
}
