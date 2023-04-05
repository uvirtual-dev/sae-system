import axios from "axios"
import { types } from "../types"
import { typesModules, typesAbilities, setServerInstance } from "../../../../../utility/Utils"

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`


export const delSelectedInstance = () => {
  return async (dispatch) => {
    dispatch({
      type: types.delItemSelected
    })
  }
}
// ** Get data on page or row change
export const getInstances = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.read,
            subject: typesModules.instance
          }
        }
        await axios.post(`${baseUrl}instance/getItems`, data)
          .then((response) => {
            dispatch({
              type: types.getItems,
              payload: response.data
            })
            resolve(response)
          })
          .catch((error) => {
            throw new Error(error)
          })
      } catch (error) {
        reject(error)

      }

    })

  }
}


// ** Get Item
export const getInstance = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.read,
            subject: typesModules.instance
          }
        }
        await axios.post(`${baseUrl}instance/getItem/${id}`, data)
          .then((response) => {
            dispatch({
              type: types.addItemSelected,
              payload: response.data

            })
            resolve(response)
          })
          .catch((error) => {
            throw new Error(error)
          })
      } catch (error) {
        reject(error)
      }

    })

  }
}

// ** Add new item
export const addInstance = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.created,
            subject: typesModules.instance
          },
          ...item
        }
        await axios.post(`${baseUrl}instance/createItem`, data)
          .then((response) => {
            dispatch({
              type: types.addItem,
              item
            })
            dispatch(getInstances())
            resolve(response)
          })
          .catch((error) => {
            throw new Error(error)
          })
      } catch (error) {

        reject(error)
      }

    })
  }
}

export const updateInstance = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.updated,
            subject: typesModules.instance
          },
          ...item
        }
        await axios.put(`${baseUrl}instance/updateItem/${item.id}`, data)
          .then((response) => {

            dispatch({
              type: types.updateItem
            })

            resolve(response)
          })
          .catch((error) => {
            throw new Error(error)
          })
      } catch (error) {
        reject(error)

      }

    })
  }
}


// ** Delete user
export const deleteInstance = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.deleted,
            subject: typesModules.instance
          },
          id
        }
        await axios.post(`${baseUrl}instance/deleteItem/${id}`, data)
          .then((response) => {
            dispatch({
              type: types.deleteItem
            })
            dispatch(getInstances())
            resolve(response)
          })
          .catch((error) => {
            throw new Error(error)
          })
      } catch (error) {
        reject(error)

      }

    })
  }
}

export const cloneItem = (id) => {
  return (dispatch, getState) => {
    axios
      .post(`${baseUrl}role/clone`, { id })
      .then((response) => {
        dispatch(setEditOn(Math.random(), response.data.items))
      })
      .then(() => {
        dispatch(getData(getState().programs.params))
      })
  }
}

