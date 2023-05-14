'use strict';
export default class Personal {
    static #table
    static #modal
    
    static async init() {
        
        document.querySelector('#tablas').innerHTML = `
            <h1 class='my-10 text-2xl font-bold media-1080:text-3xl'>Tabla de Usuarios</h1>
            <div id="personal">Tabla</div>
        `
        let response = await Helpers.fetchData(`${localStorage.getItem("url")}/usuarios/todos`)

        this.#table = new Tabulator("#personal", {
            data: response.data,
            height: "50vh",
            layout: "fitColumns",
            columns: [
                { title: "ID", field: "identificacion", hozAlign: "center", headerFilter: "input", headerFilterLiveFilter: true},
                { title: "NOMBRES", field: "nombres", hozAlign: "center", headerFilter: "input", headerFilterLiveFilter: true},
                { title: "APELLIDOS", field: "apellidos", hozAlign: "center", headerFilter: "input", headerFilterLiveFilter: true},
                { title: "PERFIL", field: "perfil", hozAlign: "center", headerFilter: "input", headerFilterLiveFilter: true},
                { formatter: this.#editRowButton, width: 40, hozAlign: "center", cellClick: this.#formEditPersonal},
                { formatter: this.#deleteRowButton, width: 40, hozAlign: "center", cellClick: this.#delete}
            ],
            footerElement: `
                <div class='flex justify-end w-full'>
                    <button id="btn-footer" class='bg-teal-900 text-gray-50 rounded px-3 py-1 hover:bg-black transition-colors duration-500'>Agregar</button>
                </div>
            `.trim()
        })

        this.#table.on("tableBuilt", () => {
            document.getElementById('btn-footer').addEventListener('click', this.#addPersonal)
        })
    }

    static #editRowButton = () => `<button class="text-green-600" id="edit" title="Editar">${Icons.edit}</button>`
    static #deleteRowButton = () => `<button class="text-red-600" title="Eliminar">${Icons.delete}</button>`
    
    static #formEditPersonal = (e, cell) => {
        e.preventDefault()
        this.#modal = new Modal({
            title: "Edición de Usuarios",
            content: `
                <form class="grid gap-5 media-600:grid-cols-2">
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="name">Nombres</label>
                        <input type="text" id="name" class="bg-white border-gray-300 p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500 border-2 rounded-md" placeholder="Nombres" value="${cell.getRow().getData().nombres}">
                    </div>
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="surname">Apellidos</label>
                        <input type="text" id="surname" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Apellidos" value="${cell.getRow().getData().apellidos}">
                    </div>
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="profile">Perfil</label>
                        <select class="w-full rounded-md h-11 border-2 border-solid border-gray-300 p-2 bg-white text-black outline-none transition-all duration-500 focus:border-blue-800"
                            id="type-user">
                            <option>${cell.getRow().getData().perfil}</option>
                            <option>PASAJERO</option>
                            <option>ADMINISTRADOR</option>
                            <option>AUXILIAR</option>
                        </select>
                    </div>
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="id">Nueva Contraseña</label>
                        <input type="password" id="password" class="bg-white border-gray-300 p-2 focus:border-blue-800 outline-none border-solid transition-all duration-500 border-2 rounded-md" placeholder="Nueva Contraseña">
                    </div>
                </form>
            `,
            buttons: [
                {
                    id: "ok",
                    style: "btn btn-outline btn-info",
                    html: `${Icons.penFill}<span class="pl-1">Terminado</span>`,
                    callBack: async () => {
                        if (Helpers.expresiones.nombre.test(document.getElementById('name').value) &&
                            Helpers.expresiones.nombre.test(document.getElementById('surname').value) &&
                            Helpers.expresiones.password.test(document.getElementById('password').value)) {
                                try {
                                    let response = await Helpers.fetchData(`${localStorage.getItem("url")}/usuarios/${cell.getRow().getData().identificacion}`,
                                    {
                                        method: 'PUT',
                                        body: {
                                            identificacion: cell.getRow().getData().identificacion,
                                            nombres: document.getElementById('name').value,
                                            apellidos: document.getElementById('surname').value,
                                            perfil: document.getElementById('type-user').value,
                                            password: document.getElementById('password').value
                                        }
                                    })
                                    if (JSON.parse(JSON.stringify(response)).message == 'ok') {
                                        Toast.info({
                                            message: 'Usuario modificado exitosamente!',
                                            mode: "success"
                                        })
                                        cell.getRow().update({
                                            "nombres": document.getElementById('name').value,
                                            "apellidos": document.getElementById('surname').value,
                                            "perfil": document.getElementById('type-user').value
                                        })
                                    } else {
                                        Toast.info({
                                            message: `${response.message}`,
                                            mode: "error"
                                        })
                                    }
                                    this.#modal.dispose()
                                } catch (e) {
                                    console.log(e);
                                }
                        } else {
                            Toast.info({
                                message: 'Rellena los espacios correctamente!',
                                mode: "warning"
                            })
                        }   
                    }
                }
            ]
        }).show()        
    }
    static #addPersonal = async () => {

        this.#modal = new Modal({
            title: "Agregar Usuarios",
            content: `${await Helpers.loadPage('./resources/html/form-add-personal.html')}`,
            buttons: [
                {
                    id: "create-user",
                    style: "btn btn-outline btn-success",
                    html: `${Icons.addPerson}<span class="pl-1">Crear Usuario</span>`,
                    callBack: async () => {
                        const dataForm = {
                            name: document.getElementById('name').value,
                            surname: document.getElementById('surname').value,
                            password: document.getElementById('password').value,
                            id: document.getElementById('id-user').value,
                            profile: document.getElementById('type-user').value
                        }
                        if (Helpers.expresiones.nombre.test(dataForm.name) &&
                        Helpers.expresiones.nombre.test(dataForm.surname) &&
                        Helpers.expresiones.password.test(dataForm.password)) {
                            try {
                                let response = await Helpers.fetchData(`${localStorage.getItem("url")}/usuarios`, {
                                    method: 'POST',
                                    body: {
                                        identificacion: dataForm.id,
                                        nombres : dataForm.name,
                                        apellidos : dataForm.surname,
                                        perfil : dataForm.profile,
                                        password: dataForm.password
                                    }
                                })
                                if (response.message == 'ok') {
                                    Toast.info({
                                        message: 'Usuario creado correctamente!',
                                        mode: "success"
                                    })
                                    this.#table.addRow({
                                        identificacion: dataForm.id,
                                        nombres: dataForm.name,
                                        apellidos: dataForm.surname,
                                        perfil: dataForm.profile
                                    }, true);
                                    this.#modal.dispose()
                                } else {
                                    Toast.info({
                                        message: `${response.message}`,
                                        mode: "error"
                                    })
                                }
                            } catch (e) {
                                console.log(e);
                            } 
                        } else {
                            Toast.info({
                                message: 'Rellena los espacios correctamente!',
                                mode: "warning"
                            })
                        }                           
                    }
                }
            ]
        }).show()
    }
    static #delete = (e, cell) => {
        e.preventDefault();
        const info = cell.getRow().getData()
        this.#modal = new Modal({
            title: "Eliminar Usuario",
            content: `
                <div class="p-8">
                    <p class="font-medium text-center text-xl">¿Seguro que quieres eliminar a ${info.nombres} ${info.apellidos}<br> con identificación ${info.identificacion}?</p>
                </div>
            `,
            buttons: [
                {
                    id: "eliminar",
                    style: "btn btn-outline btn-success",
                    html: `${Icons.confirm}<span class="pl-1">Sí</span>`,
                    callBack: async () => {
                        try {
                            let user = await Helpers.fetchData(`${localStorage.getItem("url")}/usuarios/${info.identificacion}`, { method: 'DELETE' })
                            if (JSON.parse(JSON.stringify(user)).message == 'ok') {
                                Toast.info({
                                    message: 'Usuario eliminado exitosamente!',
                                    mode: "success"
                                })
                                cell.getRow().delete();
                            } else {
                                Toast.info({
                                    message: `${user.message}`,
                                    mode: "error"
                                })
                            }
                            this.#modal.dispose()
                        } catch (e) {
                            console.log(e);
                        }                        
                    }
                },{
                    id: "cancelar",
                    style: "btn btn-outline btn-error",
                    html: `${Icons.cancel}<span class="pl-1">No</span>`,
                    callBack: () => this.#modal.dispose()
                }
            ]
        }).show()
    }
}