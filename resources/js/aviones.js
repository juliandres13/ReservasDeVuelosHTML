'use strict';

// import Helpers from "./helpers";

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
                    style: "rounded-md py-1 text-green-500 pl-3 pr-3 bg-white hover:bg-green-200",
                    html: `${Icons.ok}<span class="pt-1 pl-1 text-black font-semibold">Terminado</span>`,
                    callBack: async () => {
                        if (Helpers.expresiones.other.test(document.getElementById('modelo').value)) {
                            try {
                                let response1 = await Helpers.fetchData(`${localStorage.getItem('url')}/aviones/${info.matricula}`,
                                {
                                    method: 'PUT',
                                    body: {
                                        matricula: info.matricula,
                                        modelo: document.getElementById('modelo').value
                                    }
                                })
                                if (response1.message == 'ok') {
                                    alert("modifico el modelo")
                                    cell.getRow().update({
                                        "modelo": document.getElementById('modelo').value
                                    })
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
                                        alert("modifico las sillas")
                                        Helpers.showToast({
                                            icon: `${Icons.check}`,
                                            message: 'Avión modificado exitosamente!',
                                        })
                                        cell.getRow().update({
                                            "ejecutivas": document.getElementById('executive').value,
                                            "economicas": document.getElementById('economic').value
                                        })
                                        editPlane.dispose()
                                    } else {
                                        Helpers.showToast({
                                            icon: `${Icons.alert}`,
                                            message: `Se modificó el modelo pero ${response2.message}`,
                                        })
                                    }

                                } else {
                                    Helpers.showToast({
                                        icon: `${Icons.alert}`,
                                        message: `${response1.message}`,
                                    })
                                }
                                editPlane.dispose()


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
                    style: "rounded-md py-1 text-green-500 pl-3 pr-3 bg-white hover:bg-green-200",
                    html: `${Icons.confirm}<span class="pt-1 pl-1 text-black font-semibold">Sí</span>`,
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
                    style: "rounded-md text-red-500 py-1 pl-3 pr-3 bg-white hover:bg-red-200",
                    html: `${Icons.cancel}<span class="pt-1 text-black font-semibold">No</span>`,
                    callBack: () => modal.dispose()
                }
            ]
        }).show()
    }
}