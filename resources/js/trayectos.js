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
                { formatter: Trayectos.#editRowButton, width: 40, hozAlign: "center" },
                { formatter: Trayectos.#deleteRowButton, width: 40, hozAlign: "center" }
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

    static #addTrayecto = () => {
        let modalAddTrayecto = new Modal({
            title: "Añadir Trayecto",
            content: Helpers.loadPage('./resources/html/formCreateTrayectos.html').innerHTML,
            buttons: [
                {

                }
            ]
        }).show()

    }
}