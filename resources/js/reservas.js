'use strict';
export default class VuelosDeReservas {
    static #modal
    static #table
    static #users
    static #flights
    static #infoForm
    static #chairs
    static #formReservas

    static async init() {
        document.querySelector('#tablas').innerHTML = `
            <h1 class='my-10 text-2xl font-bold media-1080:text-3xl'>Tabla de Reservas</h1>
            <div id="reservas"></div>
        `
        let response = await Helpers.fetchData(`${localStorage.getItem("url")}/vuelos-reservas`)
        this.#formReservas = await Helpers.loadPage('./resources/html/form-reservas.html')

        this.#users = await Helpers.fetchData(`${localStorage.getItem("url")}/usuarios/todos`)
        this.#users.data.forEach((user) => {
            user.idname = `${user.identificacion} - ${user.nombres}`
        })

        this.#flights = Helpers.flat((await Helpers.fetchData(`${localStorage.getItem("url")}/vuelos`)).data)
        this.#flights.forEach((flight) => {
            flight.toOption = `${flight.origen} - ${flight.destino} / ${DateTime.fromISO(flight.fechaHora).toFormat("yyyy-MM-dd hh:mm a")} / ${flight.matricula}`
        })

        const data = Helpers.flat(response.data)

        this.#table = new Tabulator("#reservas", {
            data: data,
            height: "100vh",
            layout: "fitColumns",
            columns: [
                { title: "USUARIO",
                columns: [
                    { title: "ID", field: "identificacion", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                    { title: "NOMBRES", field: "nombres", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                    { title: "APELLIDOS", field: "apellidos", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},
                    { title: "PERFIL", field: "perfil", hozAlign: "center", headerFilter:"input", headerFilterLiveFilter: true},

                ]},
                { title: "CANCELADA", field: "cancelada", hozAlign: "center", formatter:"tickCross", formatterParams: {
                    allowEmpty: true,
                    allowTruthy: true,
                    tickElement:"<i class='fa-solid fa-check text-green-500'></i>",
                    crossElement:"<i class='fa-solid fa-xmark text-red-500'></i>",
                }},
                { title: "FECHA/HORA RESERVA", field: "fechaHora", hozAlign: "center", formatter: (cell, formatterParams) => {
                    const { outputFormat = "yyyy-MM-dd hh:mm a" } = formatterParams
                    let value = cell.getValue()
                    return DateTime.fromISO(value).toFormat(outputFormat)
                }},
                { formatter: this.#editRowButton, width: 40, hozAlign: "center", cellClick: this.#editReservation },
                { formatter: this.#deleteRowButton, width: 40, hozAlign: "center", cellClick: this.#deleteReservation }
            ],
            footerElement: `
                <div class='flex justify-end w-full'>
                    <button id="btn-add-reservation" class='bg-teal-900 text-gray-50 rounded px-3 py-1 hover:bg-black transition-colors duration-500'>Agregar Reserva</button>
                </div>
            `.trim(),
            rowFormatter: (row) => {
                var holderEl = document.createElement('div')
                var tableEl = document.createElement('div')

                holderEl.style.boxSizing = 'border-box'
                holderEl.style.padding = '10px 30px 10px 10px'
                holderEl.style.borderTop = '1px solid #333'
                holderEl.style.borderBotom = '1px solid #333'

                tableEl.style.border = '1px solid #333'

                holderEl.appendChild(tableEl)

                row.getElement().appendChild(holderEl)

                const data2 = Helpers.flat(row.getData().vuelos)

                if (row.getData().vuelos.length > 0) {
                    const subTable = new Tabulator(tableEl, {
                        layout: "fitColumns",
                        columnDefaults: {
                            resizable: true
                        },
                        data: data2,
                        columns: [
                            { title: "VUELOS ASOCIADOS A LA RESERVA",
                            columns: [
                                { title: "CHECK-IN", field: "checkIn", hozAlign: "center", formatter:"tickCross", formatterParams: {
                                    allowEmpty: true,
                                    allowTruthy: true,
                                    tickElement:"<i class='fa-solid fa-check text-green-500'></i>",
                                    crossElement:"<i class='fa-solid fa-xmark text-red-500'></i>",
                                }},
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
                            ]}
                        ],
                        footerElement: `
                            <div class='flex justify-end w-full'>
                                <button id="add-reservation-flight" class='bg-teal-900 text-gray-50 rounded px-3 py-1 hover:bg-black transition-colors duration-500'>Agregar Vuelo a la Reserva</button>
                            </div>
                        `.trim()
                    })
                } else {
                    const subTable = new Tabulator(tableEl, {
                        layout: "fitColumns",
                        columnDefaults: {
                            resizable: true
                        },
                        columns: [
                            { title: "SIN VUELOS RESERVADOS" }
                        ]
                    })
                }
            }
        })

        this.#table.on("tableBuilt", () => {
            document.getElementById('btn-add-reservation').addEventListener('click', this.#addReservation)
        })
    }
    static #editRowButton = () => `<button class="text-green-600" title="Editar">${Icons.edit}</button>`
    static #deleteRowButton = () => `<button class="text-red-600" title="Eliminar">${Icons.delete}</button>`

    static #addReservation = async () => {
        this.#modal = new Modal({
            title: "Agregar Reservación",
            content: await this.#createForm(),
            buttons: [
                {
                    id: "reservation-add",
                    html: `${Icons.plusCircle}<span class="pl-1">Añadir Reserva</span>`,
                    style: "btn btn-outline btn-success",
                    callBack: async (e) => {
                        e.preventDefault()
                        this.#infoForm.fechaHoraReserva = document.getElementById('date-time').value
                        this.#infoForm.usuario = document.getElementById('usuario').value
                        this.#infoForm.silla = document.getElementById('chair-position').value
                        try {
                            let response = await Helpers.fetchData(`${localStorage.getItem("url")}/reservas`, {
                                method: "POST",
                                body: {
                                    fechaHora: this.#infoForm.fechaHoraReserva,
                                    usuario: this.#infoForm.usuario
                                }
                            })
                            if (response.message == 'ok') {
                                for (let i = 0; i < this.#chairs.data.length; i++) {
                                    if (this.#chairs.data[i].posicion == this.#infoForm.silla) {
                                        try {
                                            let response2 = await Helpers.fetchData(`${localStorage.getItem("url")}/vuelos-reservas`, {
                                                method: "POST",
                                                body: {
                                                    fechaHoraReserva: this.#infoForm.fechaHoraReserva,
                                                    usuario: this.#infoForm.usuario,
                                                    fechaHoraVuelo: this.#infoForm.fechaHora,
                                                    origen: this.#infoForm.origen,
                                                    destino: this.#infoForm.destino,
                                                    avion: this.#infoForm.matricula,
                                                    fila: this.#chairs.data[i].fila,
                                                    columna: this.#chairs.data[i].columna
                                                }
                                            })
                                            if (response2.message == 'ok') {
                                                Toast.info({
                                                    message: "Reserva de vuelo agregada satisfactoriamente!",
                                                    mode: "success"
                                                })
                                            } else {
                                                Toast.info({
                                                    message: `${response2.message}`,
                                                    mode: "error"
                                                })
                                            }
                                        } catch (error) {
                                            console.log(error);
                                            Toast.info({
                                                message: "Sin acceso a la adición de vuelos para una reserva",
                                                mode: "info"
                                            })
                                        }
                                    }
                                }
                                this.#modal.dispose()
                            } else {
                                Toast.info({
                                    message: `${response.message}`,
                                    mode: "error"
                                })
                            }
                        } catch (error) {
                            console.log(error);
                            Toast.info({
                                message: "No se puede acceder a la creación de reservas",
                                mode: "info"
                            })
                        }
                    }
                }
            ],
            callBack: async () => {
                document.getElementById('flights').addEventListener('change', async (e) => {
                    e.preventDefault()
                    for (let i = 0; i < this.#flights.length; i++) {
                        if (this.#flights[i].toOption === document.getElementById('flights').value) {
                            this.#infoForm = this.#flights[i]
                            this.#chairs = await Helpers.fetchData(`${localStorage.getItem("url")}/vuelos-reservas/libres/fechaHora=${this.#infoForm.fechaHora}&origen=${this.#infoForm.origen}&destino=${this.#infoForm.destino}&avion=${this.#infoForm.matricula}`)
                            console.log(this.#chairs.data);
                            if (this.#chairs.message == 'ok') {
                                this.#chairs.data.forEach((chair) => {
                                    chair.PU = `${chair.posicion} - ${chair.ubicacion}`
                                })
                                const chairsOption = Helpers.toOptionList({ items: this.#chairs.data, value: 'posicion', text: 'PU' })
                                document.getElementById('chair-position').innerHTML = chairsOption
                            }
                        }
                    }
                })
                document.getElementById('flights').dispatchEvent(new Event('change'))
            }
        }).show()

    }
    static #editReservation(e, cell) {
        console.log(e, cell.getRow().getData(), "hi there!");
    }
    static #deleteReservation = (e, cell) => {
        const info = cell.getRow().getData()
        this.#modal = new Modal({
            title: "Eliminar Reservación",
            content: `
                <div class="p-8">
                    <p class="font-medium text-center text-xl">¿Seguro que quieres eliminar la reserva del usuario ${info.nombres} con ID ${info.identificacion}?<br>Fecha y Hora Reserva: ${DateTime.fromISO(info.fechaHora).toFormat("yyyy-MM-dd hh:mm a")}</p>
                </div>`,
            buttons: [
                {
                    id: "delete",
                    style: "btn btn-outline btn-success",
                    html: `${Icons.confirm}<span class="pl-1">Sí</span>`,
                    callBack: async () => {
                        try {
                            let response = await Helpers.fetchData(`${localStorage.getItem("url")}/reservas/fechaHora=${info.fechaHora}&usuario=${info.identificacion}`, { method: 'DELETE' })
                            if (response.message == 'ok') {
                                Toast.info({
                                    message: "Reserva eliminada",
                                    mode: "success"
                                })
                                cell.getRow().delete()
                            } else {
                                Toast.info({
                                    message: `${response.message}`,
                                    mode: "error"
                                })
                            }
                            this.#modal.dispose()
                        } catch (error) {
                            Toast.info({
                                message: "No se puede acceder a la eliminación de reservas.",
                                mode: "info"
                            })
                        }
                    }
                },{
                    id: "cancel",
                    style: "btn btn-outline btn-error",
                    html: `${Icons.cancel}<span class="pl-1">No</span>`,
                    callBack: () => { this.#modal.dispose() }
                }
            ]
        }).show()

    }
    static #createForm = async () => {
        const users = Helpers.toOptionList({ items: this.#users.data, value: 'identificacion', text: 'idname' })
        const flights = Helpers.toOptionList({ items: this.#flights, value: 'toOption', text: 'toOption' })
        let datetime = DateTime.local().toISODate()+"T"+DateTime.local().toFormat('HH:mm')
        const html = this.#formReservas.translate(users, datetime, flights)
        return html
    }
}