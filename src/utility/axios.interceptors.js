import axios from "axios"
import { getAccessToken, isTokenActive } from "./Utils"

import errorResponse from "./error.response"
import handleError from "./handle.error"
const abortController = new AbortController()

export const AxiosInterceptor = () => {

    const updateHeaderToken = (request, token) => {
        const newHeader = {
            "x-token": token,
            "Content-Type": "application/json"

        }
        request.headers = newHeader
        return request
    }

    const updateHeaderWs = (request) => {
        const newHeader = {
            "Content-Type": "application/json"
        }
        request.headers = newHeader
        return request
    }
   
    axios.interceptors.request.use((request) => {
        if (request.url && !request.url.includes("api/auth")) {
            const token = getAccessToken()
            if (token) updateHeaderToken(request, token)
        }
        if (request.url && (request.url.includes("webservice/rest/server.php"))) {
             updateHeaderWs(request)
        }
        return request
    }, (error) => {

        return Promise.reject(error)
    })

    axios.interceptors.response.use(
            (response) => response,
            (error) => {
              handleError(error)
              return  Promise.reject(error.response)
            })
}

export const abort = () => {
    abortController.abort()
}