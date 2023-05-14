'use strict';

export default class Vuelos {
    static #table
    static #trayectos
    static #aviones
    static #modal
    static #formVuelos
    static #currentOption

    static async init() {
        document.querySelector('#tablas').innerHTML = `
            <h1 class='my-10 text-2xl font-bold media-1080:text-3xl'>Tabla de Vuelos</h1>
            <div id="vuelos"></div>
        `
        this.#trayectos = await Helpers.fetchData(`${localStorage.getItem("url")}/trayectos`)
        this.#trayectos.data.forEach((t) => {
            t.OD = `${t.origen} - ${t.destino}`
        })

        this.#aviones = await Helpers.fetchData(`${localStorage.getItem("url")}/aviones`)
        this.#aviones.data.forEach((a) => {
            a.MM = `${a.matricula} - ${a.modelo}`
        })

        this.#formVuelos = await Helpers.loadPage('./resources/html/form-vuelos.html')

        let response = await Helpers.fetchData(`${localStorage.getItem("url")}/vuelos`)

        const data = Helpers.flat(response.data)

        this.#table = new Tabulator("#vuelos", {
            data: data,
            layout: "fitColumns",
            height: "350px",
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
                    { title: "MODELO", field: "modelo", hozAlign: "center", headerFilter: "input", headerFilterLiveFilter: true},
                    { title: "MATRICULA", field: "matricula", hozAlign: "center", headerFilter: "input", headerFilterLiveFilter: true},
                ]},
                { title: "CANCELADO", field: "cancelado", hozAlign: "center", width: 40, headerVertical: true, formatter:"tickCross", formatterParams: {
                    allowEmpty: true,
                    allowTruthy: true,
                    tickElement:"<i class='fa-solid fa-check text-green-500'></i>",
                    crossElement:"<i class='fa-solid fa-xmark text-red-500'></i>",
                }},
                { title: "FECHA/HORA", field: "fechaHora", hozAlign: "center", formatter: (cell, formatterParams) => {
                    const { outputFormat = "dd-MM-yyyy hh:mm a" } = formatterParams
                    let value = cell.getValue()
                    return DateTime.fromISO(value).toFormat(outputFormat)
                }},
                { formatter: this.#editRowButton, width: 40, hozAlign: "center", cellClick: this.#updateFlight },
                { formatter: this.#deleteRowButton, width: 40, hozAlign: "center", cellClick: this.#deleteFlight }
            ],
            footerElement: `
                <div class='flex justify-end w-full'>
                    <button id="btn-footer" class='bg-teal-900 text-gray-50 rounded px-3 py-1 hover:bg-black transition-colors duration-500'>Agregar</button>
                </div>
            `.trim()
        })

        this.#table.on("tableBuilt", () => {
            document.getElementById('btn-footer').addEventListener('click', this.#addFlight)
        })
    }
    static #editRowButton = () => `<button class="text-green-600" title="Editar">${Icons.edit}</button>`
    static #deleteRowButton = () => `<button class="text-red-600" title="Eliminar">${Icons.delete}</button>`

    static #addFlight = async (e) => {
        this.#currentOption = "add"
        this.#modal = new Modal({
            title: "Añadir un Vuelo",
            content: this.#createForm(),
            buttons: [
                {
                    id: "ok",
                    style: "btn btn-outline btn-success",
                    html: `${Icons.plusCircle}<span class="pl-1">agregar vuelo</span>`,
                    callBack: () => this.#add()
                }
            ]
        }).show()
    }

    static #add = async () => {
        if (!Helpers.okForm("#form-vuelos")) {
            return
        }
        const data = this.#getFormData()
        console.log(data);
        try {
            let response = await Helpers.fetchData(`${localStorage.getItem('url')}/vuelos`, {
                method: "POST",
                body: data,
            })

            if (response.message == "ok") {
                data.matricula = data.avion
                this.#table.addRow(data, true)
                Toast.info({
                    message: 'Vuelo añadido satisfactoriamente!',
                    mode: "success"
                })
                this.#modal.dispose()
            } else {
                Toast.info({
                    message: `${response.message}`,
                    mode: "error"
                })
            }            
        } catch (error) {
            Toast.info({
                message: "Sin acceso a la creación de vuelos",
                mode: "info"
            })
        }
    }

    static #updateFlight = (e, cell) => {
        this.#currentOption = "edit"
        const info = cell.getRow().getData()
        console.log(info);
        this.#modal = new Modal({
            title: "Actualizar vuelo",
            content: this.#createForm(cell.getRow().getData()),
            buttons: [
                {
                    id: "update",
                    html: `${Icons.penFill}<span class="pl-1">Actualizar vuelo</span>`,
                    style: "btn btn-outline btn-info",
                    callBack: () => this.#update(cell.getRow()),
                }
            ],
        }).show()
    }

    static #update = async (row) => {
        if (!Helpers.okForm("#form-vuelos")) {
            return
        }

        const data = this.#getFormData()
        console.log(data);

        try {
            let response = await Helpers.fetchData(`${localStorage.getItem('url')}/vuelos`, {
                method: "PUT",
                body: data,
            })

            if (response.message === "ok") {
                data.matricula = data.avion
                row.update(data)
                Toast.info({
                    message: 'Vuelo modificado satisfactoriamente!',
                    mode: "success"
                })
                this.#modal.dispose()
            } else {
                Toast.info({
                    message: `${response.message}`,
                    mode: "error"
                })            
            }
        } catch (error) {
            Toast.info({
                message: 'Sin acceso a la actualización de vuelos',
                mode: "info"
            })
        }
    }

    static #deleteFlight = (e, cell) => {
        this.#currentOption = "delete"
        const info = cell.getRow().getData()
        this.#modal = new Modal({
            title: "Eliminar vuelo",
            content: `
            <div class="p-8">
                <p class="font-medium text-center text-xl">¿Seguro que quieres eliminar el vuelo ${info.origen} - ${info.destino}?<br>
                Fecha y Hora: ${DateTime.fromISO(info.fechaHora).toFormat("yyyy-MM-dd hh:mm a")}</p>
            </div>
            `,
            buttons: [
                {
                    id: "delete",
                    style: "btn btn-outline btn-error",
                    html: `${Icons.delete}<span class="pl-1">eliminar vuelo</span>`,
                    callBack: () => this.#delete(cell.getRow())
                }
            ]
        }).show()
    }

    static async #delete (row) {
        const data = row.getData()
        data.avion = data.matricula
        const queryString = Object.keys(data).map((key) => `${key}=${data[key]}`).join('&')
        try {
            let response = await Helpers.fetchData(`${localStorage.getItem('url')}/vuelos/${queryString}`, { method: "DELETE" })
            if (response.message == 'ok') {
                row.delete()
                Toast.info({
                    message: 'Vuelo eliminado satisfactoriamente!',
                    mode: "success"
                })
            } else {
                Toast.info({
                    message: `${response.message}`,
                    mode: "error"
                })
            }
            this.#modal.dispose()
        } catch (error) {
            Toast.info({
                message: 'Sin acceso a eliminar vuelos',
                mode: "info"
            })
        }
    }

    /**
     * @param {Object} Un objeto con los datos de la fila a actualizar o nada si se va a agregar un registro
     * @returns
     */
    static #createForm = ({ origen = "", destino = "", matricula = "", fechaHora = "", cancelado = false , modelo = ""} = {}) => {
        // crear la lista de opciones para el select de trayectos
        const trayectos = Helpers.toOptionList({
            items: this.#trayectos.data,
            value: "OD",
            text: "OD",
            selected: `${origen} - ${destino}`
        })

        // crear la lista de opciones para el select de aviones
        const aviones = Helpers.toOptionList({
            items: this.#aviones.data,
            value: "matricula",
            text: "MM",
            selected: matricula,
        })

        // sólo se puede editar el estado de cancelado o no, por lo tanto bloquear el resto de entradas
        let disabled = ''
        if (this.#currentOption === 'edit') {
            disabled = 'disabled'
        } 
        
        // inyectar en el formulario de vuelos los datos del objeto recibido como argumento y 
        // deshabilitar las entradas que no se pueden cambiar cuando se actualiza el vuelo
        const htmlForm = this.#formVuelos.translate(trayectos, aviones, fechaHora, cancelado ? "checked" : "", disabled, disabled, disabled)

        return htmlForm
    }

    /**
     * Recupera los datos del formulario y crea un objeto para ser retornado
     * @returns Un objeto con los datos del vuelo
     */
    static #getFormData() {
        const fechaHora = document.querySelector(`#${this.#modal.id} #date-time`).value
        // ubicar el trayecto con base en el índice del elemento de lista seleccionado
        const iTrayecto = document.querySelector(`#${this.#modal.id} #path`).selectedIndex
        const trayecto = this.#trayectos.data[iTrayecto]
        //Duration.fromISO(vuelo.trayecto.duracion).toFormat('hh:mm')
        const duracion = trayecto.duracion
        // ubicar el avión con base en el índice del elemento de lista seleccionado
        const avion = document.querySelector(`#${this.#modal.id} #plane`).value
        let modelo = ''
        for (let index = 0; index < this.#aviones.data.length; index++) {
            if (this.#aviones.data[index].matricula == document.querySelector(`#${this.#modal.id} #plane`).value) {
                modelo = this.#aviones.data[index].modelo
            }        
        }
        const cancelado = document.querySelector(`#${this.#modal.id} #estado`).checked

        return {
            fechaHora,
            origen: trayecto.origen,
            destino: trayecto.destino,
            duracion: trayecto.duracion,
            costo: trayecto.costo,
            avion,
            cancelado,
            modelo
        }
    }
}