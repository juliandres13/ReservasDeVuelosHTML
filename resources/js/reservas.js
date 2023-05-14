'use strict';

export default class Reservas {

    constructor() {
        this.#init()
    }
    async #init() {
        document.querySelector('#tablas').innerHTML = `
            <h1 class='my-10 text-2xl font-bold media-1080:text-3xl'>Tabla de Reservas</h1>
            <div id="reservas"></div>
        `
        let response = await Helpers.fetchData(`${localStorage.getItem("url")}/reservas`)

        const data = Helpers.flat(response.data)

        let table = new Tabulator("#reservas", {
            data: data,
            layout: "fitColumns",
            columns: [
                { title: "ID", field: "identificacion", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                { title: "NOMBRES", field: "nombres", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                { title: "APELLIDOS", field: "apellidos", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                { title: "PERFIL", field: "perfil", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                { title: "CANCELADA", field: "cancelada", hozAlign: "center", formatter:"tickCross", formatterParams: {
                    allowEmpty: true,
                    allowTruthy: true,
                    tickElement:"<i class='fa-solid fa-check text-green-500'></i>",
                    crossElement:"<i class='fa-solid fa-xmark text-red-500'></i>",
                }},
                { title: "FECHA/HORA", field: "fechaHora", hozAlign: "center", formatter: (cell, formatterParams) => {
                    const { outputFormat = "yyyy-MM-dd hh:mm a" } = formatterParams
                    let value = cell.getValue()
                    return DateTime.fromISO(value).toFormat(outputFormat)
                }},
                { formatter: Reservas.#editRowButton, width: 40, hozAlign: "center" },
                { formatter: Reservas.#deleteRowButton, width: 40, hozAlign: "center" }
            ],
        })
    }
    static #editRowButton = () => `<button class="text-green-600" title="Editar">${Icons.edit}</button>`
    static #deleteRowButton = () => `<button class="text-red-600" title="Eliminar">${Icons.delete}</button>`
}