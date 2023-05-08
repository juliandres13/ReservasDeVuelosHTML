'use strict';

export default class Vuelos {

    static async init() {
        document.querySelector('#tablas').innerHTML = `
            <h1 class='my-10 text-2xl font-bold media-1080:text-3xl'>Tabla de Vuelos</h1>
            <div id="vuelos"></div>
        `
        let response = await Helpers.fetchData(`${localStorage.getItem("url")}/vuelos`)

        const data = Helpers.flat(response.data)

        let table = new Tabulator("#vuelos", {
            data: data,
            layout: "fitColumns",
            
            columns: [
                { title: "TRAYECTO",
                columns: [
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
                ]},
                { title: "AVIÓN",
                columns: [
                    { title: "MODELO", field: "modelo", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                    { title: "MATRICULA", field: "matricula", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                ]},
                { title: "CANCELADO", field: "cancelado", hozAlign: "center", width: 40, headerVertical: true, formatter:"tickCross", formatterParams: {
                    allowEmpty: true,
                    allowTruthy: true,
                    tickElement:"<i class='fa-solid fa-check text-green-500'></i>",
                    crossElement:"<i class='fa-solid fa-xmark text-red-500'></i>",
                }},
                { title: "FECHA/HORA", field: "fechaHora", hozAlign: "center", headerFilter:"date", formatter: (cell, formatterParams) => {
                    const { outputFormat = "dd-MM-yyyy hh:mm a" } = formatterParams
                    let value = cell.getValue()
                    return DateTime.fromISO(value).toFormat(outputFormat)
                }},
                { formatter: Vuelos.#editRowButton, width: 40, hozAlign: "center" },
                { formatter: Vuelos.#deleteRowButton, width: 40, hozAlign: "center" }
            ],
        })
    }
    static #editRowButton = () => `<button class="text-green-600" title="Editar">${Icons.edit}</button>`
    static #deleteRowButton = () => `<button class="text-red-600" title="Eliminar">${Icons.delete}</button>`
}