import axios from "axios"
import themeConfig from "@configs/themeConfig"
import { types } from "../types"
import { typesModules, typesAbilities, isUserLoggedIn } from "../../../../../utility/Utils"

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`
// ** Get all Data

export const deleteData = () => {
  return async (dispatch) => {
    dispatch({
      type: types.deleteData
    })
  }
}

// ** Get data on page or row change
export const getRoleModules = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {

        const data = {
          dataUser: {
            ability: typesAbilities.read,
            subject: typesModules.roleModules
          }
        }
        await axios.post(`${baseUrl}roleModules/getItems`, data)
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
        console.log(error)
        reject(error)
      }
    })

  }
}


// ** Get Item
export const getRoleModule = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {

        const data = {
          dataUser: {
            ability: typesAbilities.read,
            subject: typesModules.roleModules

          }
        }
        await axios.post(`${baseUrl}roleModules/getItem/${id}`, data)
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
export const addRoleModule = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {

        const data = {
          dataUser: {
            ability: typesAbilities.created,
            subject: typesModules.roleModules

          },
          ...item
        }
        console.log(data)
        await axios.post(`${baseUrl}roleModules/createItem`, data)
          .then((response) => {
            dispatch({
              type: types.addItem,
              item
            })

            dispatch(getRoleModules())
            resolve(response)
          })
      } catch (error) {
        reject(error)
      }
    })

  }
}


export const udpateRoleModule = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {

        const data = {
          dataUser: {
            ability: typesAbilities.updated,
            subject: typesModules.roleModules
          },
          ...item
        }
        console.log(data)
        await axios.put(`${baseUrl}roleModules/updateItem/${item.id}`, data)
          .then((response) => {

            dispatch({
              type: types.updateItem
            })
            dispatch({
              type: types.delItemSelected
            })
            resolve(response)
          })
      } catch (error) {
        reject(error)
      }

    })
  }
}


// ** Delete user
export const deleteRoleModule = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {

        const data = {
          dataUser: {
            ability: typesAbilities.updated,
            subject: typesModules.roleModules
          },
          id
        }
        await axios
          .post(`${baseUrl}roleModules/deleteItem/${id}`, data)
          .then((response) => {
            dispatch({
              type: types.deleteItem
            })
            dispatch(getRoleModules())

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
      .post(`${baseUrl}roleModules/clone`, { id })
      .then((response) => {
        dispatch(setEditOn(Math.random(), response.data.items))
      })
      .then(() => {
        dispatch(getData(getState().programs.params))
      })
  }
}

