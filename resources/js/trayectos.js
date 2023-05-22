
export default class Trayectos {

    static #table
    static #modal
    
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
                { formatter: this.#editRowButton, width: 40, hozAlign: "center", cellClick: this.#updateTrayecto},
                { formatter: this.#deleteRowButton, width: 40, hozAlign: "center", cellClick: this.#deleteTrayecto}
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

    static #addTrayecto = async () => {
        this.#modal = new Modal({
            title: "Añadir Trayecto",
            content: `${await Helpers.loadPage('./resources/html/form-create-trayectos.html')}`,
            buttons: [
                {
                    id: "add-path",
                    style: "btn btn-outline btn-success",
                    html: `${Icons.plusCircle}<span class="pl-1">Crear Trayecto</span>`,
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
                                        duracion: Duration.fromObject(Duration.fromISOTime(document.getElementById('duracion').value).toObject()).toISO()
                                    }
                                })
                                if (response.message == 'ok') {
                                    Toast.info({
                                        message: "Trayecto añadido exitosamente!",
                                        mode: "success"
                                    })
                                    this.#table.addRow({
                                        origen: document.getElementById('origen').value,
                                        destino: document.getElementById('destino').value,
                                        costo: document.getElementById('costo').value,
                                        duracion: Duration.fromObject(Duration.fromISOTime(document.getElementById('duracion').value).toObject()).toISO()
                                    }, true);
                                    this.#modal.dispose()
                                } else {
                                    Toast.info({
                                        message: `${response.message}`,
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
    static #deleteTrayecto = (e, cell) => {
        const info = cell.getRow().getData()
        this.#modal = new Modal({
            title: "Eliminar Trayecto",
            content: `
            <div class="p-8">
                <p class="font-medium text-center text-xl">¿Seguro que quieres eliminar el trayecto <br> ${info.origen}-${info.destino}?</p>
            </div>`,
            buttons: [
                {   
                    id: "delete",
                    style: "btn btn-outline btn-error",
                    html: `${Icons.delete}<span class="pl-1">Eliminar Trayecto</span>`,
                    callBack: async () => {
                        try {
                            let response = await Helpers.fetchData(`${localStorage.getItem('url')}/trayectos/origen=${info.origen}&destino=${info.destino}`, { method: 'DELETE' })
                            if (response.message == 'ok') {
                                Toast.info({
                                    message: "Trayecto eliminado exitosamente!",
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
                            console.log(error);
                        }
                    }
                }
            ]
        }).show()
    }
    static #updateTrayecto = (e, cell) => {
        const info = cell.getRow().getData()
        this.#modal = new Modal({
            title: "Editar Trayecto",
            content: `
            <form class="w-full mx-auto grid gap-5">
                <h2 class="font-bold">Trayecto ${info.origen}-${info.destino}</h2>
                <div class="grid media-600:grid-cols-2 gap-5">
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2" for="costo">
                            Costo
                        </label>
                        <input
                            class="appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight outline-none focus:border-blue-800 transition-all duration-500"
                            id="costo" type="number" value="${info.costo}" min="50000" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 font-bold mb-2" for="duracion">
                            Duración
                        </label>
                        <input
                            class="appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight outline-none focus:border-blue-800 transition-all duration-500"
                            id="duracion" type="text" placeholder="00:00" value="${Duration.fromISO(info.duracion).toFormat("hh:mm")}" required>
                    </div>
                </div>
            </form>
            `,
            buttons: [
                {
                    id: "update",
                    html: `${Icons.penFill}<span class="pl-1">Actualizar Trayecto</span>`,
                    style: "btn btn-outline btn-info",
                    callBack: async () => {
                        if (Helpers.expresiones.duration.test(document.getElementById('duracion').value)) {
                            try {
                                let response = await Helpers.fetchData(`${localStorage.getItem('url')}/trayectos`, {
                                    method: 'PUT',
                                    body: {
                                        origen: info.origen,
                                        destino: info.destino,
                                        costo: document.getElementById('costo').value,
                                        duracion: Duration.fromObject(Duration.fromISOTime(document.getElementById('duracion').value).toObject()).toISO()
                                    }
                                })
                                if (response.message == 'ok') {
                                    Toast.info({
                                        message: 'Trayecto actualizado exitosamente!',
                                        mode: "success"
                                    })
                                    cell.getRow().update({
                                        "costo": document.getElementById('costo').value,
                                        "duracion": Duration.fromObject(Duration.fromISOTime(document.getElementById('duracion').value).toObject()).toISO()
                                    })
                                } else {
                                    Toast.info({
                                        message: `${response.message}!`,
                                        mode: "enter"
                                    })
                                }
                                this.#modal.dispose()
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
}