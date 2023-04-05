import axios from "axios"
import themeConfig from "@configs/themeConfig"
import { types } from "../types"
import { typesModules, typesAbilities, isUserLoggedIn } from "../../../../../utility/Utils"

// const baseUrl = themeConfig.apiUrl
const baseUrl = `${process.env.REACT_APP_API_URL}/api/`

// ** Get all Data

export const delSelectedItem = () => {
  return async (dispatch) => {
    dispatch({
      type: types.delItemSelected
    })
  }
}

export const getUsersPaginate = (params) => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.read,
            subject: typesModules.user
          },
          params
        }
        await axios.post(`${baseUrl}user/getItemsPaginate`, data)
          .then((response) => {
            dispatch({
              type: types.getData,
              data: response.data.docs,
              totalPages: response.data.totalDocs,
              params,
              isLoading: false
            })
            resolve(response)
          }).catch((error) => {
            throw new Error(error)
          })
      } catch (error) {
        reject(error)

      }


    })

  }

}

// ** Get data on page or row change
export const getUsers = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.read,
            subject: typesModules.user
          }
        }
        await axios.post(`${baseUrl}user/getItems`, data)
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
export const getUser = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.read,
            subject: typesModules.user
          }
        }
        await axios.post(`${baseUrl}user/getItem/${id}`, data)
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
export const addUser = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.created,
            subject: typesModules.user
          },
          ...item
        }
        await axios.post(`${baseUrl}user/createItem`, data)
          .then((response) => {
            dispatch({
              type: types.addItem,
              item
            })
            dispatch(getUsersPaginate(getState().user.params))
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


export const udpateUser = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.updated,
            subject: typesModules.user
          },
          ...item
        }
        await axios.put(`${baseUrl}user/updateItem/${item.id}`, data)
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
export const deleteUser = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.deleted,
            subject: typesModules.user
          },
          id
        }
        await axios
          .post(`${baseUrl}user/deleteItem/${id}`, data)
          .then((response) => {
            dispatch({
              type: types.deleteItem
            })
            dispatch(getUsersPaginate(getState().user.params))
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
      .post(`${baseUrl}user/clone`, { id })
      .then((response) => {
        dispatch(setEditOn(Math.random(), response.data.items))
      })
      .then(() => {
        dispatch(getUsersPaginate(getState().programs.params))
      })
  }
}

