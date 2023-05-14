'use strict';

export default class Aviones {
    static #table
    static #modal

    static async init() {
        document.querySelector('#tablas').innerHTML = `
            <h1 class='my-10 text-2xl font-bold media-1080:text-3xl'>Tabla de Aviones</h1>
            <div id="aviones"></div>
        `
        let response = await Helpers.fetchData(`${localStorage.getItem("url")}/sillas/total`)

        const data = Helpers.flat(response.data)

        this.#table = new Tabulator("#aviones", {
            data: data,
            layout: "fitColumns",
            height: "50vh",
            columns: [
                { title: "MATRICULA", field: "matricula", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                { title: "MODELO", field: "modelo", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                { title: "SILLAS",
                    columns: [
                        { title: "EJECUTIVAS", field: "ejecutivas", hozAlign: "center", width: "150"},
                        { title: "ECONÓMICAS", field: "economicas", hozAlign: "center", width: "150"}
                ]},
                { formatter: this.#editRowButton, width: 40, hozAlign: "center", cellClick: this.#editPlane},
                { formatter: this.#deleteRowButton, width: 40, hozAlign: "center", cellClick: this.#delete}
            ],
            footerElement: `
                <div class='flex justify-end w-full'>
                    <button id="btn-footer" class='bg-teal-900 text-gray-50 rounded px-3 py-1 hover:bg-black transition-colors duration-500'>Agregar</button>
                </div>
            `.trim()
        })
        this.#table.on("tableBuilt", () => {
            document.getElementById('btn-footer').addEventListener('click', this.#createPlane)
        })
    }
    static #editRowButton = () => `<button class="text-green-600" title="Editar">${Icons.edit}</button>`
    static #deleteRowButton = () => `<button class="text-red-600" title="Eliminar">${Icons.delete}</button>`
    
    static #editPlane = (e, cell) => {
        const info = cell.getRow().getData()
        this.#modal = new Modal({
            title: "Edición de Avión",
            content: `
            <form class="grid gap-5">
                <h2 class="font-bold">Avión con matrícula ${info.matricula}</h2>
                <div class="grid-cols-1 gap-5 grid">
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="modelo">Modelo del Avión</label>
                        <input type="text" id="modelo" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Modelo" value="${cell.getRow().getData().modelo}">
                    </div>
                </div>
                <h2 class="font-bold">Sillas</h2>
                <div class="media-600:grid-cols-2 gap-5 grid">
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="executive">Ejecutivas</label>
                        <input type="number" id="executive" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Sillas Ejecutivas" value="${cell.getRow().getData().ejecutivas}" required>
                    </div>
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="economic">Económicas</label>
                        <input type="number" id="economic" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Sillas Económicas" value="${cell.getRow().getData().economicas}" required>
                    </div>
                </div>
            </form>
            `,
            buttons: [
                {
                    id: "edit",
                    style: "btn btn-outline btn-info",
                    html: `${Icons.penFill}<span class="pl-1">actualizar avión</span>`,
                    callBack: async () => {
                        if (Helpers.expresiones.other.test(document.getElementById('modelo').value)) {
                            try {
                                let response1 = await Helpers.fetchData(`${localStorage.getItem("url")}/sillas/avion/${info.matricula}`, { method: 'DELETE' })
                                if (response1.message == 'ok') {
                                    let response2 = await Helpers.fetchData(`${localStorage.getItem("url")}/sillas`,
                                    {
                                        method: 'POST',
                                        body: {
                                            avion: info.matricula,
                                            ejecutivas: document.getElementById('executive').value,
                                            economicas: document.getElementById('economic').value
                                        }
                                    })
                                    if (response2.message == 'ok') {
                                        cell.getRow().update({
                                            "ejecutivas": document.getElementById('executive').value,
                                            "economicas": document.getElementById('economic').value
                                        })
                                        let response3 = await Helpers.fetchData(`${localStorage.getItem('url')}/aviones/${info.matricula}`,
                                        {
                                            method: 'PUT',
                                            body: {
                                                matricula: info.matricula,
                                                modelo: document.getElementById('modelo').value
                                            }
                                        })
                                        if (response3.message == 'ok') {
                                            cell.getRow().update({
                                                "modelo": document.getElementById('modelo').value
                                            })
                                            Toast.info({
                                                message: 'Avión modificado exitosamente!',
                                                mode: "success"
                                            })
                                        } else {
                                            Toast.info({
                                                message: `${response3.message}`,
                                                mode: "error"
                                            })
                                        }
                                        this.#modal.dispose()
                                    } else {
                                        Toast.info({
                                            message: `${response2.message}`,
                                            mode: "info"
                                        })
                                    }
                                } else {
                                    Toast.info({
                                        message: `Sillas no modificadas, el ${info.matricula} existe en vuelos!`,
                                        mode: "error"
                                    })
                                }
                            } catch (error) {
                                console.log(error);
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
    static #createPlane = () => {
        this.#modal = new Modal({
            title: "Añadir Avión",
            content: `
            <form class="grid gap-5">
                <h2 class="font-bold">Avión</h2>
                <div class="media-600:grid-cols-2 gap-5 grid">
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="matricula">Matrícula del Avión</label>
                        <input type="text" id="matricula" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Matrícula">
                    </div>
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="modelo">Modelo del Avión</label>
                        <input type="text" id="modelo" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Modelo">
                    </div>
                </div>
                <h2 class="font-bold">Sillas</h2>
                <div class="media-600:grid-cols-2 gap-5 grid">
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="executive">Ejecutivas</label>
                        <input type="number" id="executive" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Sillas Ejecutivas" required>
                    </div>
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="economic">Económicas</label>
                        <input type="number" id="economic" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Sillas Económicas" required>
                    </div>
                </div>
            </form>`,
            buttons: [
                {
                    id: "create-plane",
                    style: "btn btn-outline btn-success",
                    html: `${Icons.plusCircle}<span class="pl-1">Añadir Avión</span>`,
                    callBack: async () => {
                        if (Helpers.expresiones.other.test(document.getElementById('modelo').value) &&
                        Helpers.expresiones.other.test(document.getElementById('matricula').value)) {
                            try {
                                let response = await Helpers.fetchData(`${localStorage.getItem("url")}/aviones`,
                                {
                                    method: 'POST',
                                    body: {
                                        modelo: document.getElementById('modelo').value,
                                        matricula: document.getElementById('matricula').value,
                                    }
                                })
                                if (response.message == 'ok') {

                                    this.#table.addRow({
                                        modelo: document.getElementById('modelo').value,
                                        matricula: document.getElementById('matricula').value,
                                        ejecutivas: 0,
                                        economicas: 0
                                    }, true);
                                    
                                    let response2 = await Helpers.fetchData(`${localStorage.getItem("url")}/sillas`, {
                                        method: 'POST',
                                        body: {
                                            avion: document.getElementById('matricula').value,
                                            ejecutivas: document.getElementById('executive').value,
                                            economicas: document.getElementById('economic').value
                                        }
                                    })
                                    if (response2.message == 'ok') {
                                        this.#table.getRows()[0].update({
                                            "ejecutivas": document.getElementById('executive').value,
                                            "economicas": document.getElementById('economic').value
                                        })
                                        Toast.info({
                                            message: "Avión añadido exitosamente!",
                                            mode: "success"
                                        })
                                    } else {
                                        Toast.info({
                                            message: `${response2.message}`,
                                            mode: "info"
                                        })
                                    }
                                    this.#modal.dispose()
                                } else {
                                    Toast.info({
                                        message: `${response.message}`,
                                        mode: "error"
                                    })
                                }
                            } catch (error) {
                                Toast.info({
                                    message: 'Sin acceso a creación de aviones',
                                    mode: "info"
                                })
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
            title: "Eliminar Avión",
            content: `
                <div class="p-8">
                    <p class="font-medium text-center text-xl">¿Seguro que quieres eliminar al avión ${info.modelo} con matricula ${info.matricula}?</p>
                </div>
            `,
            buttons: [ 
                {
                    id: "eliminar",
                    style: "btn btn-outline btn-success",
                    html: `${Icons.confirm}<span class="pl-1">Sí</span>`,
                    callBack: async () => {
                        try {
                            let response1 = await Helpers.fetchData(`${localStorage.getItem("url")}/sillas/avion/${info.matricula}`, { method: 'DELETE' })
                            if (response1.message == 'ok') {
                                let response2 = await Helpers.fetchData(`${localStorage.getItem("url")}/aviones/${info.matricula}`, { method: 'DELETE' })
                                if (response2.message == 'ok') {
                                    Toast.info({
                                        message: 'Avión eliminado exitosamente!',
                                        mode: "success"
                                    })
                                    cell.getRow().delete();
                                } else {
                                    Toast.info({
                                        message: `Sillas eliminadas pero ${response2.message}`,
                                        mode: "warning"
                                    })
                                }
                            } else {
                                Toast.info({
                                    message: `El ${info.matricula} existe en vuelos!`,
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