import axios from "axios"
import { types } from "../types"
import { typesModules, typesAbilities, setServerInstance } from "../../../../../utility/Utils"

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`

export const addNewInstance = (data) => {
  return async (dispatch) => {
    dispatch({
      type: types.addDataNew,
      payload: data
    })
  }
}

export const delNewInstance = () => {
  return async (dispatch) => {
    dispatch({
      type: types.delDataNew
    })
  }
}


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
          reject(error)
        })
    })

  }
}


// ** Get Item
export const getInstance = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {

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
          setServerInstance(response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)

        })
    })

  }
}

// ** Add new item
export const addInstance = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      await axios.post(`${baseUrl}role/createItem`, item)
        .then((response) => {
          dispatch({
            type: types.addItem,
            item
          })
          dispatch(getInstances())
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export const udpateInstance = (item, props) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      await axios.put(`${baseUrl}role/updateItem/${item.id}`, item)
        .then((response) => {
          if (props.history) {
            props.history.push(`/apps/role/list`)
          }
          dispatch({
            type: types.updateItem
          })

          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}


// ** Delete user
export const deleteInstance = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      await axios.post(`${baseUrl}role/deleteItem/${item.id}`, item)
        .then((response) => {
          dispatch({
            type: types.deleteItem
          })
          dispatch(getInstances())
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
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

