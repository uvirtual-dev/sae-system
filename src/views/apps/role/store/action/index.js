import axios from "axios"
import themeConfig from "@configs/themeConfig"
import { types } from "../types"
import { typesModules, typesAbilities, isUserLoggedIn } from "../../../../../utility/Utils"

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`
// ** Get all Data

export const addNewData = (data) => {
  return async (dispatch) => {
    dispatch({
      type: types.addDataNew,
      payload: data
    })
  }
}

export const delNewData = () => {
  return async (dispatch) => {
    dispatch({
      type: types.delDataNew
    })
  }
}

export const addSelectedPermissions = (roleId, type = 'node') => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      try {
        const config = {
          headers: {
            'x-token': getState().auth.userData.accessToken
          }
        }
        const data = {
            dataUser: {
              userId: getState().auth.userData.id,
              ability: typesAbilities.read,
              subject: typesModules.rolePermissions
          },
          roleId
        }
        await axios.post(`${baseUrl}rolePermissions/getItems`, data, config)
        .then((response) => {
             console.log(response)
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
        console.log(error)
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
export const getItems = () => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
       
        const config = {
          headers: {
            'x-token': getState().auth.userData.accessToken          }
        }
        const data = {
            dataUser: {
              userId: getState().auth.userData.id,
              ability: typesAbilities.read,
              subject: typesModules.role
          }
        }
        await axios.post(`${baseUrl}role/getItems`, data, config)
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
export const getItem = (id) => {
  return (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      try {
          const config = {
            headers: {
              'x-token': getState().auth.userData.accessToken
            }
          }
          const data = {
              dataUser: {
                userId: getState().auth.userData.id,
                ability: typesAbilities.read,
                subject: typesModules.role
            }
          }
          await axios.post(`${baseUrl}role/getItem/${id}`, data, config)
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
        console.log(error)
        reject(error)
      }
    })

  }
}

// ** Add new item
export const addItem = (item) => {
  return (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      try {
      const config = {
        headers: {
          'x-token': getState().auth.userData.accessToken
        }
      }
      await  axios.post(`${baseUrl}role/createItem`, item, config)
      .then((response) => {
        dispatch({
          type: types.addItem,
          item
        })
        dispatch(getItems())
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


export const udpateItem = (item, props) => {
  return (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      try {
        const config = {
          headers: {
            'x-token': getState().auth.userData.accessToken
          }
        }
        await axios.put(`${baseUrl}role/updateItem/${item.id}`, item, config)
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
export const deleteItem = (item) => {
  return (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      try {
      const config = {
        headers: {
          'x-token': getState().auth.userData.accessToken
        }
      }
      await  axios
      .post(`${baseUrl}role/deleteItem/${item.id}`, item, config)
      .then((response) => {
        dispatch({
          type: types.deleteItem
        })
        dispatch(getItems())
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

