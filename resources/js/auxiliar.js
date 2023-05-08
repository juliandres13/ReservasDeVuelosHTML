'use strict'

export default class Auxiliar {
    #data
    constructor(personalData) {
        this.#data = personalData

        document.querySelector('.navegacion').innerHTML = `
        <nav class="nav hidden media-1080:flex flex-shrink basis-auto justify-center items-center">
            <a href="" class="search hover:text-white"><i class="fa-solid fa-magnifying-glass"></i> buscar</a>
            <a href="" class="tickets hover:text-white"><i class="fa-solid fa-ticket"></i> tiquetes</a>
            <a href="" class="contact hover:text-white"><i class="fa-solid fa-phone"></i> contacto</a>
            <a href="" class="help hover:text-white"><i class="fa-solid fa-circle-info"></i> ayuda</a>
        </nav>
        <nav class="desktop hidden media-1080:flex flex-auto justify-end items-center media-1080:pr-12">
            <i class="account fa-solid fa-circle-user pr-2.5 text-size-xl hover:text-white"><a href=""></a></i>
            <i class="log-out fa-solid fa-arrow-right-from-bracket bg-white-1 p-2.5 rounded-lg hover:bg-gray-500 hover:text-white" title="Cerrar Sesión"><a href=""></a></i>
        </nav>
        <nav class="laptop flex media-1080:hidden flex-auto justify-end items-center w-1/2 h-20 pr-6">
            <i class="search fa-solid fa-magnifying-glass hover:text-white"><a href=""></a></i>
            <i class="tickets fa-solid fa-ticket hidden media-600:flex hover:text-white"><a href=""></a></i>
            <i class="contact hidden media-600:flex fa-solid fa-phone hover:text-white"><a href=""></a></i>
            <i class="account fa-solid fa-circle-user hover:text-white"><a href=""></a></i>
            <i class="help hidden media-600:flex fa-solid fa-circle-info hover:text-white"><a href=""></a></i>
            <i class="log-out hidden media-600:flex fa-solid fa-arrow-right-from-bracket text-white hover:text-orange-500"></i>
            <i class="fa-solid fa-bars hover:text-white cursor-none media-600:hidden" id="bars"><a href=""></a></i>
        </nav>
        `
        document.querySelector('.icons').innerHTML = `
            <a href="" class="tickets hover:text-white"><i class="fa-solid fa-ticket"></i> tiquetes</a>
            <a href="" class="contact hover:text-white"><i class="fa-solid fa-phone"></i> contacto</a>
            <a href="" class="help hover:text-white"><i class="fa-solid fa-circle-info"></i> ayuda</a>
            <a href="" class="log-out bg-white-1 rounded-md hover:bg-gray-500 hover:text-white">cerrar sesión <i class="fa-solid fa-arrow-right-from-bracket"></i></a>
        `
        document.querySelector('.text-header').innerHTML = `
            <h2 class="content-margin px-6 py-10 text-2xl text-gray-200 font-bold media-1080:px-12 media-1080:text-3xl" id="welcome">Bienvenido ${this.#data.nombres}!</h2>
            <div class="content-margin">
                <h3 class="text-gray-200 px-6 text-center font-bold media-1080:px-12" id="p-aux" style="margin-top: 40vh;">¡Bienvenido de nuevo a nuestra página! Nos alegra mucho verte por aquí de nuevo después de tanto tiempo. Esperamos que disfrutes explorando todas las novedades y mejoras que hemos agregado desde tu última visita. ¡Que tengas un buen día!</h3>
            </div>
        `

        const icons = document.querySelector('.icons')
        const navBarToggle = document.querySelector('#bars')
        const listOptions = document.querySelectorAll('.search, .tickets, .contact, .help, .account, .log-out, .log-text')
        const options = document.querySelectorAll('.nav-middle > a')

        document.getElementById('auxiliar').innerHTML = `
            <h1 class="font-bold my-10 text-2xl media-1080:text-3xl">Tus Funciones</h1>
            <section class="functions">
                <article>
                    <h2 class="font-bold text-xl">Revisar registros</h2><br>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, a! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod, nam. Explicabo, blanditiis sed. Dolor, dignissimos?</p>
                    <a href="#" class="mx-0">Ir...</a>
                </article>
                <article>
                    <h2 class="font-bold text-xl">Capacitaciones</h2><br>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, a! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod, nam. Explicabo, blanditiis sed. Dolor, dignissimos?</p>
                    <a href="#" class="mx-0">Ir...</a>
                </article>
                <article>
                    <h2 class="font-bold text-xl">Equipo de trabajo</h2><br>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, a! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod, nam. Explicabo, blanditiis sed. Dolor, dignissimos?</p>
                    <a href="#" class="mx-0">Ir...</a>
                </article>
                <article>
                    <h2 class="font-bold text-xl">Cosas por hacer</h2><br>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, a! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod, nam. Explicabo, blanditiis sed. Dolor, dignissimos?</p>
                    <a href="#" class="mx-0">Ir...</a>
                </article> 
            </section>
            <div class="see-all flex justify-end mt-2.5">
                <a href="#">Ver todo ></a>
            </div>
        `

        navBarToggle.addEventListener('click', () => {
            icons.classList.toggle('hidden')
            icons.classList.toggle('flex')
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
                this.#options(e.target.text);
            })
        })
    }
    async #mainMenu(option) {
        switch (option) {
            case 'search':
                console.log('cargó');
                break;
            case 'tickets':
                console.log("cargó");
                break;
            case 'contact':
                Helpers.toggle('#welcome', '#p-aux')
                await Helpers.loadPage("./resources/html/contact.html", 'main')
                break;
            case 'help':
                Helpers.toggle('#welcome', '#p-aux')
                await Helpers.loadPage("./resources/html/help.html", 'main')
                break;
            case 'account':
                console.log("cargó");
                break;
            case 'log-out':
                localStorage.removeItem("user")
                Helpers.configPage('bg-img-aux', 'bg-img-pag-principal')
                const { default: Index } = await import(`./index.mjs`)
                new Index();
                break;
            case 'log-text':
                const { default: Auxiliar } = await import(`./auxiliar.js`)
                new Auxiliar(this.#data);
                break;
            default:
                break;
        }
    }
    async #options(option) {
        switch (option) {
            case 'Vuelos':
                const { default: Vuelos } = await import(`./vuelos.js`)
                await Vuelos.init()
                break;
            case 'Trayectos':
                const { default: Trayectos } = await import(`./trayectos.js`)
                new Trayectos()
                break;
            case 'Reservas':
                const { default: Reservas } = await import(`./reservas.js`)
                new Reservas()
                break;
            case 'Crear':
                console.log("carga");
                break;
            case 'Actualizar':
                console.log("carga");
                break;
            case 'Eliminar':
                console.log("carga");
                break;
            default:
                break;
        }
    }
}
