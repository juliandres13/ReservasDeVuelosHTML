'use strict';

export default class Aviones {
    static #table

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
        let editPlane = new Modal({
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
                <div class="grid-cols-2 gap-5 grid">
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="executive">Ejecutivas</label>
                        <input type="text" id="executive" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Sillas Ejecutivas" value="${cell.getRow().getData().ejecutivas}">
                    </div>
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="economic">Económicas</label>
                        <input type="text" id="economic" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Sillas Económicas" value="${cell.getRow().getData().economicas}">
                    </div>
                </div>
            </form>
            `,
            buttons: [
                {
                    id: "ok",
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
                                            Helpers.showToast({
                                                icon: `${Icons.check}`,
                                                message: 'Avión modificado exitosamente!',
                                            })
                                        } else {
                                            Helpers.showToast({
                                                icon: `${Icons.alert}`,
                                                message: `${response3.message}`,
                                            })
                                        }
                                        editPlane.dispose()
                                    } else {
                                        Helpers.showToast({
                                            icon: `${Icons.alert}`,
                                            message: `${response2.message}`,
                                        })
                                    }
                                } else {
                                    Helpers.showToast({
                                        icon: `${Icons.alert}`,
                                        message: `${response1.message}`,
                                    })
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        } else {
                            Helpers.showToast({
                                icon: `${Icons.alert}`,
                                message: 'Rellena los espacios correctamente!',
                            }) 
                        }
                    }
                }
            ]
        }).show()
    }
    static #createPlane = () => {
        let modalAddPlane = new Modal({
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
                        <input type="text" id="executive" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Sillas Ejecutivas">
                    </div>
                    <div class="inline-grid w-full mb-3">
                        <label class="mb-2 font-semibold" for="economic">Económicas</label>
                        <input type="text" id="economic" class="bg-white border-gray-300 border-2 rounded-md p-2 focus:border-blue-800 border-solid outline-none transition-all duration-500" placeholder="Sillas Económicas">
                    </div>
                </div>
            </form>`,
            buttons: [
                {
                    id: "create-user",
                    style: "btn btn-outline btn-success",
                    html: `${Icons.plusCircle}<span class="pl-1">Añadir Avión</span>`,
                    callBack: async () => {
                        if (
                        Helpers.expresiones.numeros.test(document.getElementById('executive').value) &&
                        Helpers.expresiones.other.test(document.getElementById('modelo').value) &&
                        Helpers.expresiones.numeros.test(document.getElementById('economic').value) &&
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
                                        Helpers.showToast({
                                            icon: `${Icons.check}`,
                                            message: "Avión añadido exitosamente!",
                                        })
                                    } else {
                                        Helpers.showToast({
                                            icon: `${Icons.alert}`,
                                            message: `${response2.message}`,
                                        })
                                    }
                                    modalAddPlane.dispose()
                                } else {
                                    Helpers.showToast({
                                        icon: `${Icons.alert}`,
                                        message: `${response.message}`,
                                    })
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        } else {
                            Helpers.showToast({
                                icon: `${Icons.alert}`,
                                message: 'Rellena los espacios correctamente!',
                            }) 
                        }
                    }
                }
            ]
        }).show()
    }
    static #delete = (e, cell) => {
        e.preventDefault();
        let info = cell.getRow().getData()
        let modal = new Modal({
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
                                    Helpers.showToast({
                                        icon: `${Icons.check}`,
                                        message: 'Avión eliminado exitosamente!',
                                    })
                                    cell.getRow().delete();
                                } else {
                                    Helpers.showToast({
                                        icon: `${Icons.alert}`,
                                        message: `Sillas eliminadas pero ${response2.message}`,
                                    })
                                }
                            } else {
                                Helpers.showToast({
                                    icon: `${Icons.alert}`,
                                    message: `${response1.message}`,
                                })
                            }
                            modal.dispose()
                        } catch (e) {
                            console.log(e);
                        }                        
                    }
                },{
                    id: "cancelar",
                    style: "btn btn-outline btn-error",
                    html: `${Icons.cancel}<span class="pl-1">No</span>`,
                    callBack: () => modal.dispose()
                }
            ]
        }).show()
    }
}