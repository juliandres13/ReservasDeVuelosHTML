export default class Toast {
    static #init(mode) {
        const colors = {
            white: "bg-white",
            bluelight: "bg-[#BAD7E9]"
        }
        switch (mode) {
            case "success":
                return {
                    title: "Acción exitosa!",
                    color: "alert-success",
                    icon: Icons.success
                }
            case "warning":
                return {
                    title: "¡Cuidado!",
                    color: "alert-warning",
                    icon: Icons.warning
                }
            case "error":
                return {
                    title: "Error!",
                    color: "alert-error",
                    icon: Icons.error
                }
            case "info":
                return {
                    title: "Información!",
                    color: "alert-info",
                    icon: Icons.info
                }
            case "enter":
                return {
                    title: 'Bienvenido!',
                    color: colors.bluelight,
                    icon: Icons.doorOpen
                }
            default:
                return {
                    title: "...",
                    color: "",
                    icon: Icons.question
                } 
        }

    }
    static info(
        {
            message = "",
            mode = "info",
            error = "",
            sleep = 3500
        } = {}
    ) {
        const { title, color, icon } = this.#init(mode)
        const id = `toast-${Math.floor(Math.random() * 99999).toString()}`
        const zIndex = "z-50"

        const html = `
            <div class="alert ${color} fixed right-5 bottom-[5vh] mx-auto max-w-fit shadow-lg w-full ${zIndex} shadow-black" id="${id}">
                <div class="ease-in-out">
                    ${icon}
                    <span class="font-bold">${title}</span>
                    <span class="font-semibold">${message}</span>
                </div>
            </div>
        `
        document.querySelector('body').insertAdjacentHTML('beforebegin', html)

        setTimeout(() => { document.getElementById(`${id}`).remove() }, sleep)

        if (error) {
            console.error("ERROR", error);
        }
    }
}