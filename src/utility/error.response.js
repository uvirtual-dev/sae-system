// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

const errorResponse = (error) => {
    let htmlError = ""
    switch (error.status) {
        case 404:
            htmlError =  `Se produjo un error, por favor actualiza la página. <br><br><p class="text-danger">${error.statusText}</p>`
            break
        case 401:
            htmlError =  `Usuario no autorizado. <br><br<p class="text-danger">${error.statusText}</p>`
            break
    
        default:
            break
    }

    MySwal.fire({
        title: "Error!",
        html: htmlError,
        icon: "error",
        buttonsStyling: true,
        showConfirmButton: false
      })
}

export default errorResponse