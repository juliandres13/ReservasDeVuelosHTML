'use strict'

export default class InicioSesion {
    #op
    #modal
    #callBack
    constructor(option, modal, init) {
        this.#op = option
        this.#modal = modal
        this.#callBack = init
        this.#changeForm();

        const button = document.getElementById('ok');
        const form = document.getElementById('form');
        const inputs = document.querySelectorAll('#form input');

        document.getElementById('btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.#changeForm();
        })

        inputs.forEach((input) => {
            input.addEventListener('keyup', (e) => Helpers.validarForm(e.target));
            input.addEventListener('blur', (e) => Helpers.validarForm(e.target));
        })

        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (document.getElementById('h2').textContent == 'Acceso') {
                this.#logIn(form);
            } else {
                this.#signUp(form);
            }
        })
    }
    /**
     * Verifica la validez global del formulario, y posterior comunica los datos del formulario con el servidor para autenticar al usuario
     * @param {*} form Elemento con el bloque del formulario 
     */
    async #logIn(form) {
        if (Helpers.campos.user && Helpers.campos.password === true) {
            try {
            
                let response = await Helpers.fetchData(`${localStorage.getItem("url")}/usuarios/autenticar`, {
                    method: 'POST',
                    body: {
                        identificacion: document.querySelector('#user').value,
                        password: document.querySelector('#password').value
                    }
                })

                if (response.message === 'ok') {
                    // comentar que hace
                    localStorage.setItem("user", JSON.stringify(response.data))
                    Helpers.loadUserPage(response, this.#callBack)
                    this.#modal.dispose()
                    form.reset();
                } else {
                    Helpers.showToast({
                        icon: `${Icons.alert}`,
                        message: 'Usuario o contraseña errónea',
                        log: response
                    })
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            Helpers.showError()
        }
    }
    /**
     * Verifica la validez global del formulario, y posterior comunica los datos del formulario con el servidor para crear un nuevo usuario
     * @param {*} form Elemento con el bloque del formulario
     */
    async #signUp(form) {
        if (Helpers.campos.name && Helpers.campos.surname && Helpers.campos.user && Helpers.campos.password === true) {         
            try {
                
                let response = await Helpers.fetchData(`${localStorage.getItem("url")}/usuarios`, {
                    method: 'POST',
                    body: {
                        identificacion: document.querySelector('#user').value,
                        nombres : document.querySelector('#name').value,
                        apellidos : document.querySelector('#surname').value,
                        perfil : "PASAJERO",
                        password: document.querySelector('#password').value
                    }
                })
                
                if (response.message === 'ok') {
                    let user = await Helpers.fetchData(`${localStorage.getItem("url")}/usuarios/${document.querySelector('#user').value}`)
                    localStorage.setItem("user", JSON.stringify(user.data))
                    Helpers.loadUserPage(user, this.#callBack)
                    this.#modal.dispose()
                    form.reset();
                } else {
                    Helpers.showToast({
                        icon: `${Icons.alert}`,
                        message: 'Registro Fallido!',
                        log: response
                    })
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            Helpers.showError()
        }
    }
    /**
     * Hace aparecer un formulario para logging o para registro
     */
    async #changeForm() {
        if (this.#op == 'log-in-js') {
            this.#op = 'sign-up'
            document.getElementById('register').classList.add('hidden');
            document.getElementById('h2').innerHTML = `Acceso`
            document.querySelector('#change-p > p').innerHTML = `¿No tienes cuenta?`
            document.getElementById('btn').innerHTML = `Regístrate.`
        } else {
            this.#op = 'log-in-js'
            document.getElementById('register').classList.remove('hidden');
            document.getElementById('h2').innerHTML = `Registro`
            document.querySelector('#change-p > p').innerHTML = `¿Ya estás con nosotros?`
            document.getElementById('btn').innerHTML = `Inicia sesión.`
        }
    }
}
