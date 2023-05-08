export default class Modal {
    #id
    #modal
    constructor({
        style = "w-11/12 media:w-8/12 media:w-6/12 media-1080:w-8/12",
        title = "",
        content = "",
        buttons = [], // los botones que se agregan al footer
        callBack = null, // un callBack
    } = {}) {
        // una de las muchas formas de agregar un elemento al DOM con un id único
        // hacer caso omiso a la advertencia del flex/hidden
        this.#id = "modal-" + Math.floor(Math.random() * 99999999999999).toString().padStart(14, "0")
        document.querySelector("body").insertAdjacentHTML(
            "beforeend", `
              <div id="${this.#id}" class="flex fixed inset-0 z-40 justify-center items-center bg-blue-900 bg-opacity-50 hidden">
                  <div class="relative mx-auto my-6 ${style}">
                      <div class="flex selection:relative flex-col w-full bg-white rounded-lg border-0 shadow-lg outline-none focus:outline-none">
                          <header class="flex justify-between items-start px-5 py-2 rounded-t border-b-2 border-gray-200 border-solid">
                              <h2 id="title-${this.#id}" class="text-xl font-semibold text-sky-950"></h2>
                              <button id="close" title="Cerrar" class="float-right ml-auto text-3xl font-semibold leading-none bg-transparent border-0 outline-none">
                                    <span class="block h-0 text-2xl bg-transparent outline-none focus:outline-none"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="text-red-600 hover:text-black bi bi-x-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                              </button>
                          </header>
                          <main id="main-${this.#id}" class="overflow-y-auto relative flex-auto p-2 mx-4 my-1 max-h-96"></main>
                          <footer class="flex bg-gray-200 px-4 pt-2.5 pb-2.5 justify-end rounded-b-lg"></footer>
                      </div>
                  </div>
              </div>`
        )
        this.title = title
        this.content = content
        this.buttons = buttons
        this.#modal = document.querySelector(`#${this.#id}`)

        if (typeof callBack === "function") {
          callBack(this.#id)
        }
    }

    get id() {
        return this.#id
    }

    /**
     * Establecer el título del cuadro de diálogo
     * @param {string} _title
     */
    set title(_title) {
        document.querySelector(`#title-${this.#id}`).innerHTML = _title
        return this
    }

    /**
     * Establecer el contenido del cuadro de diálogo
     * @param {string} _content
     */
    set content(_content) {
        document.querySelector(`#main-${this.#id}`).innerHTML = _content
        return this
    }

    /**
     * Agregar botones al pie de página del modal u ocultar el pie de página
     * @param {any[]} _buttons
     */
    set buttons(_buttons) {
        const footer = document.querySelector(`#${this.#id} footer`)
        if (_buttons.length > 0) {
            _buttons.forEach((item) => {
                const html = `<button id="${item.id}" class="flex ml-4 ${item.style}">${item.html}</button>`
                footer.insertAdjacentHTML("beforeend", html)
                const button = document.querySelector(`#${this.#id} footer #${item.id}`)

                if (button && typeof item.callBack === "function") {
                    button.addEventListener("click", (e) => item.callBack(e))
                }
            })
        } else {
            footer.classList.add("hidden")
        }

        // el botón de cerrar de la parte superior derecha del modal
        document.querySelector(`#${this.#id} header #close`).addEventListener("click", () => this.close())
    }

    show() {
        if (this.#modal) {
            this.#modal.classList.remove("hidden")
        } else {
            console.log("No hay un Modal referenciado por esta variable")
        }
        return this
    }

    close() {
        this.#modal.classList.add("hidden")
        return this
    }

    dispose() {
        this.#modal.parentNode.removeChild(this.#modal)
        this.#modal = null
    }
}