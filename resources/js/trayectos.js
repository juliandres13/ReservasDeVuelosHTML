'use strict';
// import Modal from './modal';
// import Helpers from './helpers';
export default class Trayectos {
    static #table
    
    static async init() {
        document.querySelector('#tablas').innerHTML = `
            <h1 class='my-10 text-2xl font-bold media-1080:text-3xl'>Tabla de Trayectos</h1>
            <div id="trayectos">Tabla</div>
        `
        let response = await Helpers.fetchData(`${localStorage.getItem("url")}/trayectos`)

        this.#table = new Tabulator("#trayectos", {
            data: response.data,
            layout: 'fitColumns',
            height: '50vh',
            columns:[
                { title: "ORIGEN", field: "origen", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                { title: "DESTINO", field: "destino", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                { title: "COSTO", field: "costo", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true, formatter: "money", formatterParams: {
                    decimal: ".",
                    thousand: ",",
                    symbol: " COP",
                    symbolAfter: " ",
                    precision: false
                }},
                { title: "DURACIÓN", field: "duracion", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true, formatter: (cell, formatterParams) => {
                    const { outputFormat = "hh:mm" } = formatterParams
                    let value = cell.getValue()
                    return Duration.fromISO(value).toFormat(outputFormat)
                }},
                { formatter: this.#editRowButton, width: 40, hozAlign: "center" },
                { formatter: this.#deleteRowButton, width: 40, hozAlign: "center" }
            ],
            footerElement: `
                <div class='flex justify-end w-full'>
                    <button id="btn-footer" class='bg-teal-900 text-gray-50 rounded px-3 py-1 hover:bg-black transition-colors duration-500'>Agregar</button>
                </div>
            `.trim()
        })
        this.#table.on("tableBuilt", () => {
            document.getElementById('btn-footer').addEventListener('click', this.#addTrayecto)
        })
    }
    static #editRowButton = () => `<button class="text-green-600" title="Editar">${Icons.edit}</button>`
    static #deleteRowButton = () => `<button class="text-red-600" title="Eliminar">${Icons.delete}</button>`

    static async #addTrayecto() {
        let modalAddTrayecto = new Modal({
            title: "Añadir Trayecto",
            content: `${await Helpers.loadPage('./resources/html/form-create-trayectos.html')}`,
            buttons: [
                {
                    id: "add-path",
                    style: "btn btn-outline btn-accent",
                    html: `${Icons.confirm}<span>Crear Trayecto</span>`,
                    callBack: async () => {
                        if (Helpers.expresiones.nombre.test(document.getElementById('origen').value) &&
                        Helpers.expresiones.nombre.test(document.getElementById('destino').value) &&
                        Helpers.expresiones.duration.test(document.getElementById('duracion').value)) {
                            try {
                                let response = await Helpers.fetchData(`${localStorage.getItem("url")}/trayectos`, {
                                    method: 'POST',
                                    body: {
                                        origen: document.getElementById('origen').value,
                                        destino: document.getElementById('destino').value,
                                        costo: document.getElementById('costo').value,
                                        duracion: document.getElementById('duracion').value
                                    }
                                })
                                if (response.message == 'ok') {
                                    Helpers.showToast({
                                        icon: `${Icons.check}`,
                                        message: "Trayecto añadido exitosamente!",
                                    }) 
                                    Trayectos.#table.addRow({
                                        origen: document.getElementById('origen').value,
                                        destino: document.getElementById('destino').value,
                                        costo: document.getElementById('costo').value,
                                        duracion: document.getElementById('duracion').value
                                    }, true);
                                    modalAddTrayecto.dispose()
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
}