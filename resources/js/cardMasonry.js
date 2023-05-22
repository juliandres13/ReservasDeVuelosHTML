
export default class CardMasonry {
    #id
    #masonry
    #props
    #length

    constructor({        
        styleMasonry = 'columns-1 gap-8 p-1 media-600:columns-2 media-768:columns-3 media-1080:columns-4',
        styleCards = 'mb-6 w-full overflow-y-auto rounded-lg bg-white shadow-lg shadow-slate-600 dark:bg-white',
        styleImages = 'h-56 w-full rounded-t-lg object-cover',
        styleTitles = 'mb-2 text-2xl font-bold tracking-tight text-black',
        styleContents = 'mb-3 font-normal text-black',
        styleFooter = '',
        infoCards = [], // un array de objetos cada uno con la imagen, el títulos, el contenido y los botones de cada card
        container = '', // el id de la capa donde se inyectan los cards
        buttons = [] // los botones que se agregan al footer
    } = {}) {
        this.#id = 'masonry' + Math.floor(Math.random() * 99999999999999).toString().padStart(14, '0')
        this.#props = { styleMasonry, styleCards, styleImages, styleTitles, styleContents, styleFooter, infoCards, container, buttons }
        this.#createCards()
    }

    #createCards() {
        this.#length = 0
        let { styleMasonry, infoCards, container, buttons } = this.#props

        if (!container) {
            throw new Error('No especificó una capa contenedora para el masonry')
        }

        container = document.querySelector(container)
        if (!container) {
            throw new Error(`El contenedor "${container}" para inyectar el masonry, no es válido`)
        }

        // si infoCards es un array válido se crea el html de los cards
        let cards = ''
        if (Array.isArray(infoCards)) {
            infoCards.forEach(card => (cards += this.#toHTML(card)))
        }

        // se crea el masonry, se inyecta en el contenedor y se referencia a nivel de clase
        let htmlMasonry = `<div id="${this.#id}" class="${styleMasonry}">${cards}</div>`
        container.innerHTML = htmlMasonry
        this.#masonry = document.querySelector(`#${this.#id}`)
        this.#assignEventsToButtons()
    }

    #toHTML(card) {
        let { styleCards, styleImages, styleTitles, styleContents, styleFooter, buttons } = this.#props
        const hiddenImage = card.image ? '' : 'hidden'
        const hiddenPrice = card.price ? '' : 'hidden'
        const hiddenTitle = card.title ? '' : 'hidden'
        const hiddenContent = card.content ? '' : 'hidden'
        const hiddenButtons = buttons.length ? '' : 'hidden'
        const hiddenMain = hiddenContent && hiddenTitle ? 'hidden' : ''
        const image = hiddenImage ? '' : `<img class="${styleImages}" src="${card.image}" alt="image-card-${this.#length}"/>`

        let htmlCard = ''
        if (!Object.keys(card).length || (!image && hiddenMain)) {
            console.warn(`El elemento de la posición ${this.#length} está vacío o no tiene las propiedades necesarias`)
        } else {
            const idCard = `${this.#id}-card-${this.#length}`
            htmlCard = `
                <div id="${idCard}" class="${styleCards}">
                    ${image}
                    <div class="px-5 py-3 ${hiddenMain}">
                        <header><h5 class="${styleTitles} ${hiddenTitle}">${card.title}</h5></header>
                        <section class="${styleContents} ${hiddenContent}">
                            <strong class="${hiddenPrice}">${card.price}<br><br></strong>
                            ${card.content}
                        </section>
                        <footer id="${idCard}-footer" class="${styleFooter} ${hiddenButtons}">
                            ${this.#createButtons(buttons)}
                        </footer>
                    </div>
                </div>`
            this.#length++
        }
        return htmlCard
    }

    /**
     * Agregar botones al pie de página de las tarjetas u ocultar el pie de página
     * @param {any[]} _buttons
     */
    #createButtons(buttons) {
        let html = ''
        if (buttons.length > 0) {
            buttons.forEach(item => (html += `<button id="${this.#id}-card-${this.#length}-${item.id}" class="${item.style}">${item.html}</button>`))
        }
        return html
    }

    #assignEventsToButtons() {
        // recorrer los footers de los cards y asignar eventos a los botones:
        // https://lenguajejs.com/javascript/eventos/addeventlistener/
        const cardsFooter = document.querySelectorAll(`div[id^="${this.#id}"] footer`)
        cardsFooter.forEach(footer => {
            const idCard = footer.parentNode.parentNode.id
            const buttons = document.querySelectorAll(`#${footer.id} button`)
            this.#asignEventsToButtonsCard(buttons, idCard)
        })
    }

    #asignEventsToButtonsCard(buttons, idCard) {
        buttons.forEach((button, key) => {
            // ojo e.target, si el botón tiene hijos, devuelve el elemento hijo sobre el cual se pulsa
            // e.currentTarget devuelve el botón sin importar si se pusa sobre uno de sus hijos
            if (button && typeof this.#props.buttons[key].callBack === 'function') {
                button.addEventListener('click', e => this.#props.buttons[key].callBack(idCard, e.currentTarget))
            }
        })
    }

    get id() {
        return this.#id
    }

    get length() {
        return this.#length
    }

    get cards() {
        return document.querySelectorAll(`div[id^='${this.#id}-card']`)
    }

    /**
     * Retorna un card según el índice dado como argumento
     * @param {int} i el índice del elemento
     * @returns El div con el card solicitado
     */
    getCard(i) {
        return document.querySelector(`#${this.#id}-card-${i}`)
    }

    /**
     * Agrega al masonry un card a partir del objeto dado como argumento
     * @param {Object} card Un objeto con las propiedades necesarias para crear un card
     * @returns El div con el card agregado al masonry
     */
    add(card) {
        const cardHTML = this.#toHTML(card)
        this.#masonry.insertAdjacentHTML('beforeend', cardHTML)
        const idCard = `#${this.#id}-card-${this.#length - 1}`
        const refCard = document.querySelector(idCard)
        const buttons = document.querySelectorAll(`${idCard} button`)
        this.#asignEventsToButtonsCard(buttons, idCard)
        return refCard
    }

    /**
     * Elimina el card especificado por el índice
     * @param {int} i
     */
    remove(i) {
        document.querySelector(`#${this.#id}-card-${i}`).innerHTML = ''
    }

    removeAll() {
        this.#masonry.innerHTML = ''
    }

    show() {
        if (this.#masonry) {
            this.#masonry.classList.remove('hidden')
        } else {
            console.log('No hay un masonry referenciado por esta variable')
        }
        return this
    }

    close() {
        this.#masonry.classList.add('hidden')
        return this
    }

    dispose() {
        this.#masonry.parentNode.removeChild(this.#masonry)
        this.#masonry = null
    }
}
