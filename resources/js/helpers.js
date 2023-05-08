'use strict';

export default class Helpers {
    /**
     * Carga un recurso HTML en una capa de la aplicación
     * @param {String} url La ruta donde se encuentra el recurso
     * @param {String} container La capa donde se inserta el contenido
     * @returns Si el argumento 'container' se da, retorna el container, si no se retorna el recurso
     */
    static async loadPage(url, container = null) {
        try {
            const response = await fetch(url)
            if (response.ok) {
                const html = await response.text()
                const element = document.querySelector(container)
                if (element) {
                    element.innerHTML = html
                }
                return element || html
            } else {
                throw new Error(
                    `${response.status} - ${response.statusText}, al intentar acceder al recurso '${response.url}'`
                )
            }
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * devuelve un recurso en formato javascript ()
     * @param {String} url direccion donde se ubica el recurso
     * @param {Object} data atributos adicionales de la peticion
     * @returns una promesa con un array de objetos con los atributos class y style
     */
    static async fetchData(url, data = {}) {
        if (!('headers' in data)) {
            data.headers = {
                'Content-Type': 'application/json; charset=utf-8',
            }
        }
        
        if ('body' in data) {
            data.body = JSON.stringify(data.body)
        }
        const respuesta = await fetch(url, data)
        return await respuesta.json()
    }
    /**
     * Despliega un aviso en la parte inferior de la pantalla
     * @param {Object} param0 Un objeto con los datos del aviso
     */
    static showToast({ icon = 'icon', message = '¡Hola mundo!', log = '' } = {}) {
        if (log) {
            console.log(log)
        }
        // inyectar los elementos a mostrar en el toast
        const toast = document.querySelector("#toast")
        toast.innerHTML = `
            <div id="img">${icon}</div>
            <div id="desc">${message}</div>
        `
        toast.className = "show"
        setTimeout(hide, 4000)

        function hide() {
            toast.className = toast.className.replace("show", "")
        }
    }
    /**
     * Valida la entrada de caracteres en los campos de escritura
     * @param {*} expresion Expresión regular a evaluar en determinado campo de escritura
     * @param {*} input Caracter o caracteres ingresados en la entrada de texto
     * @param {*} campo Grupo al que pertenece el campo de escritura (user, name, surname, etc)
     */
    static validarCampo = (expresion, input, campo) => {
        if (expresion.test(input.value)) {
            document.querySelector(`#group-${campo} i`).classList.replace('opacity-0', 'opacity-100');
            document.querySelector(`#group-${campo} i`).classList.replace('fa-circle-xmark', 'fa-circle-check');
            document.getElementById(`${campo}`).classList.replace('border-red-600', 'border-gray-300');
            document.getElementById(`${campo}`).classList.replace('focus:border-red-600', 'focus:border-blue-600');
            document.querySelector(`#group-${campo} label`).classList.replace('text-red-600','text-black')
            document.querySelector(`#group-${campo} .form-input-error`).classList.replace('block', 'hidden');
            document.getElementById(`group-${campo}`).classList.add('text-green-600');
            document.getElementById(`group-${campo}`).classList.remove('text-red-600');
            Helpers.campos[campo] = true
        } else {
            document.querySelector(`#group-${campo} i`).classList.replace('opacity-0', 'opacity-100');
            document.querySelector(`#group-${campo} i`).classList.replace('fa-circle-check', 'fa-circle-xmark');
            document.getElementById(`${campo}`).classList.replace('border-gray-300', 'border-red-600');
            document.getElementById(`${campo}`).classList.replace('focus:border-blue-600', 'focus:border-red-600');
            document.querySelector(`#group-${campo} label`).classList.replace('text-black','text-red-600')
            document.querySelector(`#group-${campo} .form-input-error`).classList.replace('hidden', 'block');
            document.getElementById(`group-${campo}`).classList.remove('text-green-600');
            document.getElementById(`group-${campo}`).classList.add('text-red-600');
            Helpers.campos[campo] = false
        }
    }
    
    static expresiones = {
        usuario: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
        nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        password: /^.{3,12}$/, // 3 a 12 digitos.
        other: /^[a-zA-Z0-9\s]{4,16}$/

    }

    static campos = {
        name: false,
        surname: false,
        user: false,
        password: false,
    }

    /**
     * Valida el parecido de las entradas para las contraseñas
     * @param {*} campo Grupo al que pertenece el campo de escritura (user, name, surname, etc) 
     */
    static validarPassword = (campo) => {
        const password1 = document.getElementById('password')
        const password2 = document.getElementById('password2')

        if (password1.value === password2.value) {
            document.querySelector(`#group-${campo} i`).classList.replace('opacity-0', 'opacity-100');
            document.querySelector(`#group-${campo} i`).classList.replace('fa-circle-xmark', 'fa-circle-check');
            document.getElementById(`${campo}`).classList.replace('border-red-600', 'border-gray-300');
            document.getElementById(`${campo}`).classList.replace('focus:border-red-600', 'focus:border-blue-600');
            document.querySelector(`#group-${campo} label`).classList.replace('text-red-600','text-black')
            document.querySelector(`#group-${campo} .form-input-error`).classList.replace('block', 'hidden');
            document.getElementById(`group-${campo}`).classList.add('text-green-600');
            document.getElementById(`group-${campo}`).classList.remove('text-red-600');
            Helpers.campos['password'] = true
        } else {
            document.querySelector(`#group-${campo} i`).classList.replace('opacity-0', 'opacity-100');
            document.querySelector(`#group-${campo} i`).classList.replace('fa-circle-check', 'fa-circle-xmark');
            document.getElementById(`${campo}`).classList.replace('border-gray-300', 'border-red-600');
            document.getElementById(`${campo}`).classList.replace('focus:border-blue-600', 'focus:border-red-600');
            document.querySelector(`#group-${campo} label`).classList.replace('text-black','text-red-600')
            document.querySelector(`#group-${campo} .form-input-error`).classList.replace('hidden', 'block');
            document.getElementById(`group-${campo}`).classList.remove('text-green-600');
            document.getElementById(`group-${campo}`).classList.add('text-red-600');
            Helpers.campos['password'] = false
        }
    }
    /**
     * Valida las entradas del formulario de inicio sesion o de registro
     * @param {*} e Variable que escucha el evento
     */
    static validarForm = (e) => {
        switch (e.name) {
            case "name":
                Helpers.validarCampo(Helpers.expresiones.nombre, e, 'name')
            break;
            case "surname":
                Helpers.validarCampo(Helpers.expresiones.nombre, e, 'surname')
            break;
            case "user":
                Helpers.validarCampo(Helpers.expresiones.usuario, e, 'user')
            break;
            case "password":
                Helpers.validarCampo(Helpers.expresiones.password, e, 'password')
                Helpers.validarPassword('password2')
            break;
            case "password2":
                Helpers.validarPassword('password2')
            break;
        }
    }
    /**
     * Cambia el background de la navegación cuando se hace scroll
     */
    static async scrollNav() {
        window.addEventListener('scroll', (e) => {
            e.preventDefault();
            const nav = document.querySelector('header > nav')
            const elements = document.querySelectorAll('nav > nav > a, .navegacion a, .navegacion i')
            const logo = document.querySelector('.logo > a')

            if (window.scrollY > 0) {
                if (logo.classList.contains('log-text')) {
                    logo.classList.replace('text-gray-200', 'text-black')
                } 
                nav.classList.replace('bg-black', 'bg-white')
                nav.classList.replace('bg-opacity-10', 'bg-opacity-100')
                nav.classList.replace('shadow-transparent', 'shadow-black')
                nav.classList.replace('media-1080:h-24', 'media-1080:h-20')
                elements.forEach(element => {
                    if (element.classList.contains('bg-white-1') || element.classList.contains('bg-orange-2')) {
                        element.classList.replace('bg-white-1', 'bg-orange-2')
                    } else {
                        element.classList.replace('hover:text-white', 'hover:text-orange-500')
                    }
                })
            } else {
                if (logo.classList.contains('log-text')) {
                    logo.classList.replace('text-black', 'text-gray-200')
                }
                nav.classList.replace('bg-white', 'bg-black')
                nav.classList.replace('bg-opacity-100', 'bg-opacity-10')
                nav.classList.replace('shadow-black', 'shadow-transparent')
                nav.classList.replace('media-1080:h-20', 'media-1080:h-24')
                elements.forEach(element => {
                    if (element.classList.contains('bg-orange-2')) {
                        element.classList.replace('bg-orange-2', 'bg-white-1')
                    } else {
                        element.classList.replace('hover:text-orange-500', 'hover:text-white')
                    }
                })
            }
        })
    }
    
    /**
     * Carga la estructura HTML del respectivo tipo de usuario (administrador, auxiliar, pasajero)
     * @param {*} option Es la opción seleccionada en la etiqueta de HTML 'select' (logIn.html:55)
     * @param {*} response Objeto con los datos del usuario
     * @param {*} main Elemento HTML
     */
    static async loadUserPage(response, init) {
        

        let user = {}

        if (response.data.user) {
            user = response.data.user
        } else {
            user = response.data
        }

        Helpers.showToast({
            icon: `${Icons.doorOpen}`,
            message: `Hola ${user.nombres}!`
        })

        if (user.perfil === 'PASAJERO') {
            Helpers.configPage('bg-img-pag-principal', 'bg-img-customer')
            await Helpers.loadPage("./resources/html/customer.html", 'main');
            const { default: Pasajero } = await import(`./customer.js`)
            new Pasajero(user)

        } else if (user.perfil === 'AUXILIAR') {
            Helpers.configPage('bg-img-pag-principal', 'bg-img-aux')
            await Helpers.loadPage("./resources/html/auxiliar.html", 'main');
            const { default: Auxiliar } = await import(`./auxiliar.js`)
            new Auxiliar(user)

        } else if (user.perfil === 'ADMINISTRADOR') {
            Helpers.configPage('bg-img-pag-principal', 'bg-img-admin')
            await Helpers.loadPage("./resources/html/admin.html", 'main');
            const { default: Administrador } = await import(`./admin.js`)
            new Administrador(user, init)

        }
    }
    /**
     * Función que añade una clase a un elemento html y posterior la remueve pasado un tiempo
     */
    static async showError() {
        document.getElementById('form-message').classList.replace('hidden', 'block')
        const message = () => {
            document.getElementById('form-message').classList.replace('block', 'hidden')
        }
        setTimeout(message, 4000);
    }
    /**
     * Hace desaparecer la altura de la etiqueta <header> y oculta el contenido que hay sobre ella
     * @param {*} tag1 Nombre de la 1ra etiqueta
     * @param {*} tag2 Nombre de la 2da etiqueta
     */
    static async toggle(tag1, tag2) {
        if (document.querySelector('header').classList.contains('h-screen')) {
            document.querySelectorAll(`${tag1}, ${tag2}`).forEach(element => {
                element.classList.add('hidden')
            })
            document.querySelector('header').classList.remove('h-screen')
            document.querySelector('header').classList.remove('bg-center')
        }
    }
    
    static configPage(bg1, bg2) {
        document.querySelector('header').classList.remove(`${bg1}`)
        document.querySelector('header').classList.add(`${bg2}`)
    }

    /**
     * Retorna el array de objetos recibido, aplanado
     * @param {Array} data Un array de objetos que contienen objetos
     * @returns Array
     */
    static flat = (data) => data.map((v) => Helpers.flatten(v))

    /**
     * Aplana un objeto que contiene otros objetos
     * @param {Object} obj El objeto original que puede contener otros objetos
     * @param {Object} final El objeto aplanado
     * @returns Object
     */
    static flatten(obj, final = {}) {
        for (let key in obj) {
            if (typeof obj[key] === "object" && obj[key] != null && !Array.isArray(obj[key])) {
                this.flatten(obj[key], final)
            } else {
                final[key] = obj[key]
            }
        }
        return final
    }
    /**
     * Crea el HTML correspondiente a una lista de opciones para inyectar en un select
     * @param {Object} El objeto de definición de la lista
     * @returns El HTML con la lista de opciones
     */
    static toOptionList = ({
        items = [], // el array de objetos para crear la lista
        value = "", // el nombre del atributo de cada objeto que se usará como value
        text = "", // el nombre del atributo de cada objeto que se usará como text
        selected = "", // el valor que debe marcarse como seleccionado
        firstOption = "", // opcionalmente una opción adicional para iniciar la lista
    } = {}) => {
        let options = ""
        if (firstOption) {
            options += `<option value="">${firstOption}</option>`
        }
        items.forEach((item) => {
            if (item[value] == selected) {
                // comprobación débil adrede
                options += `<option value="${item[value]}" selected>${item[text]}</option>`
            } else {
                options += `<option value="${item[value]}">${item[text]}</option>`
            }
        })
        return options
    }
}
/**
 * Cambia las ocurrencias de $# por los strings indicados como argumento
 * @param  {...any} texts Son los strings que se usan para hacer el reemplazo
 * @returns El string original con los reemplazos realizados
 */
String.prototype.translate = function (...texts) {
    let str = this
    const regex = /\$(\d+)/gi // no requiere comprobación de mayúsculas pero se deja como ejemplo
    return str.replace(regex, (item, index) => texts[index])
}