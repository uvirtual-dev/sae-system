import axios from "axios"
import { types } from "../types"
import { typesModules, typesAbilities, isUserLoggedIn } from "../../../../../utility/Utils"

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`
// ** Get all Data


export const addSelectedPermissions = (roleId, type = 'node') => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
     
        const data = {
          dataUser: {
            userId: getState().auth.userData.id,
            ability: typesAbilities.read,
            subject: typesModules.rolePermissions
          },
          roleId
        }
        await axios.post(`${baseUrl}rolePermissions/getItems`, data)
          .then((response) => {
            const arrayNodes = []
            if (type === 'node') {
              response.data.forEach(element => {
                arrayNodes.push({
                  id: element._id,
                  module: element.module.name,
                  isRead: element.read,
                  isCreate: element.created,
                  isUpdate: element.updated,
                  isDelete: element.deleted
                })
              })
              dispatch({
                type: types.addPermissionsSelected,
                payload: arrayNodes
              })
            } else {
              dispatch({
                type: types.addPermissionsSelected,
                payload: response.data
              })
            }

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

export const delSelectedPermissions = () => {
  return async (dispatch) => {
    dispatch({
      type: types.delPermissionsSelected
    })
  }
}

export const delSelectedItem = () => {
  return async (dispatch) => {
    dispatch({
      type: types.delItemSelected
    })
  }
}
// ** Get data on page or row change
export const getRoles = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.read,
            subject: typesModules.role
          }
        }
        await axios.post(`${baseUrl}role/getItems`, data)
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
export const getRole = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            userId: getState().auth.userData.id,
            ability: typesAbilities.read,
            subject: typesModules.role
          }
        }
        await axios.post(`${baseUrl}role/getItem/${id}`, data)
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
export const addRole = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.created,
            subject: typesModules.role
          },
          ...item
        }
        await axios.post(`${baseUrl}role/createItem`, data)
          .then((response) => {
            dispatch({
              type: types.addItem,
              item
            })
            dispatch(getRoles())
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


export const updateRole = (item) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.updated,
            subject: typesModules.role
          },
          ...item
        }
        await axios.put(`${baseUrl}role/updateItem/${item.id}`, data)
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
        console.log(error)
        reject(error)
      }

    })
  }
}


// ** Delete user
export const deleteRole = (id) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = {
          dataUser: {
            ability: typesAbilities.deleted,
            subject: typesModules.role
          },
          id
        }
        await axios
          .post(`${baseUrl}role/deleteItem/${id}`, data)
          .then((response) => {
            dispatch({
              type: types.deleteItem
            })
            dispatch(getRoles())
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

