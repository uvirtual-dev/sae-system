const handleError = error => {
    console.log("Error", {error})
    let status = ''
    let msg = ''
    if (error.response === undefined && error.message) {
        status = 500
        msg = "Error connect server"
    } else {
        status = (error.response) ? error.response.status : error.status
        msg = (error.response) ? `${error.response.statusText}  ${error.response.data.msg}` : `${error.statusText}  ${error.data.msg}`
    }
    
    // console.log("Message", error.request.statusText)
    // console.log("status", error.request.status)
    // console.log("msg", error.data.msg || error.response.data.msg)
    return { message: msg, status: status || '999'}
  }
export default handleError