'use strict'

export default class Pasajero {
    #data
    #callBack
    constructor(data, callBack) {
        this.#data = data
        this.#callBack = callBack

        document.querySelector('.navegacion').innerHTML = `
            <nav class="nav hidden media-1080:flex flex-shrink basis-auto justify-center items-center">
                <a href="" class="search hover:text-white"><i class="fa-solid fa-magnifying-glass"></i> buscar</a>
                <a href="" class="personal-data hover:text-white"><i class="fa-solid fa-database"></i> mis datos</a>
                <a href="" class="contact hover:text-white"><i class="fa-solid fa-phone"></i> contacto</a>
                <a href="" class="help hover:text-white"><i class="fa-solid fa-circle-info"></i> ayuda</a>
            </nav>
            <nav class="desktop hidden media-1080:flex flex-auto justify-end items-center media-1080:pr-12">
                <i class="account fa-solid fa-circle-user pr-2.5 text-size-xl hover:text-white"><a href=""></a></i>
                <i class="log-out fa-solid fa-arrow-right-from-bracket bg-white-1 text-black p-2.5 rounded-xl hover:bg-gray-500 hover:text-white"><a href=""></a></i>
            </nav>
            <nav class="laptop flex media-1080:hidden flex-auto justify-end items-center w-1/2 h-20 pr-6">
                <i class="search fa-solid fa-magnifying-glass hover:text-white"><a href=""></a></i>
                <i class="personal-data hidden media-600:flex fa-solid fa-database hover:text-white"><a href=""></a></i>
                <i class="contact hidden media-600:flex fa-solid fa-phone hover:text-white"><a href=""></a></i>
                <i class="account fa-solid fa-circle-user hover:text-white"><a href=""></a></i>
                <i class="help hidden media-600:flex fa-solid fa-circle-info  hover:text-white"><a href=""></a></i>
                <i class="log-out hidden media-600:flex fa-solid fa-arrow-right-from-bracket text-white hover:text-orange-500"><a href=""></a></i>
                <i class="fa-solid fa-bars hover:text-white media-600:hidden" id="bars"><a href=""></a></i>
            </nav>
        `
        document.querySelector('.icons').innerHTML = `
            <a href="" class="personal-data hover:text-white"><i class="fa-solid fa-database"></i> mis datos</a>
            <a href="" class="contact hover:text-white"><i class="fa-solid fa-phone"></i> contacto</a>
            <a href="" class="help hover:text-white"><i class="fa-solid fa-circle-info"></i> ayuda</a>
            <a href="" class="log-out bg-white-1 rounded-md hover:bg-gray-500 hover:text-white">cerrar sesión <i class="fa-solid fa-arrow-right-from-bracket"></i></a>
        `
        document.querySelector('.text-header').innerHTML = `
            <h2 class="content-margin text-xl media-600:text-2xl media-1080:text-3xl px-6 my-10 media-1080:px-12 font-bold" id="welcome">Bienvenido ${this.#data.nombres}!</h2>
            <div class="content-margin px-6 media-1080:px-12">
                <h3 class="text-black text-right font-semibold media-1080:text-xl" style="margin-top: 20vh;" id="p-customer">¡Bienvenido de nuevo a nuestra página! Nos alegra mucho verte por aquí de nuevo después de tanto tiempo. Esperamos que disfrutes explorando todas las novedades y mejoras que hemos agregado desde tu última visita. ¡Que tengas un buen día!</h3>
            </div>
        `

        const icons = document.querySelector('.icons')
        const navBarToggle = document.querySelector('#bars')
        const listOptions = document.querySelectorAll('.search, .personal-data, .contact, .help, .account, .log-out')
        const options = document.querySelectorAll('.nav-middle > a')

        document.getElementById('custom').innerHTML = `
            <h1 class="my-10 text-2xl font-bold media-1080:text-3xl">Información para su viaje</h1>
            <section class="functions pb-6">
                <article class="h-full">
                    <h2 class="text-xl font-bold">Flota</h2><br>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, a! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum consectetur nemo ad porro sunt numquam! Corrupti recusandae enim ex similique?</p>
                </article>
                <article class="h-full">
                    <h2 class="text-xl font-bold">Equipaje</h2><br>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, a! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam ipsa sunt vel. Similique maiores molestias eos accusamus a quae delectus.</p>
                </article>
                <article class="h-full">
                    <h2 class="text-xl font-bold">Abordaje</h2><br>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, a! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit libero corrupti quisquam distinctio laboriosam. Ut!</p>
                </article>
                <article class="h-full">
                    <h2 class="text-xl font-bold">Información General</h2><br>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla, a! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid mollitia totam aut nulla consequuntur odit minus fugiat rem voluptate ratione.</p>
                </article>
            </section>
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
                this.#options(e.target.text)
            })
        })
    }
    async #mainMenu(option) {
        switch (option) {
            case 'search':
                console.log('cargó');
                break;
            case 'personal-data':
                console.log("cargó");
                break;
            case 'contact':
                Helpers.toggle('#welcome', '#p-customer')
                await Helpers.loadPage("./resources/html/contact.html", 'main')
                break;
            case 'help':
                Helpers.toggle('#welcome', '#p-customer')
                await Helpers.loadPage("./resources/html/help.html", 'main')
                break;
            case 'account':
                console.log("cargó");
                break;
            case 'log-out':
                localStorage.removeItem("user")
                Helpers.configPage('bg-img-customer', 'bg-img-pag-principal')
                this.#callBack()
                break;
            default:
                break;
        }
    }
    async #options(option) {
        switch (option) {
            case 'Mis Reservas':
                // const { default: Reservas } = await import(`./reservas.js`)
                // new Reservas()
                break;
            case 'Vuelos':
                const { default: Vuelos } = await import(`./vuelos.js`)
                await Vuelos.init()
                break;
            default:
                break;
        }
    }
}
