import axios from "axios"
import themeConfig from "@configs/themeConfig"
import { types } from "../types"
import {  typesModules, typesAbilities } from "../../../../../utility/Utils"
import {
  addSelectedPermissions,
  getItem as getItemPermissions
} from "../../../role/store/action"
import {getRoleModules as getModules} from '../../../roleModules/store/action'

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
// ** Get data on page or row change
export const getItems = () => {
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
          }
        }
        await axios.post(`${baseUrl}rolePermissions/getItems`, data, config)
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
                subject: typesModules.rolePermissions

            }
          }
          await axios.post(`${baseUrl}rolePermissions/getItem/${id}`, data, config)
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

      const data = {
          dataUser: {
            userId: getState().auth.userData.id,
            ability: typesAbilities.created,
            subject: typesModules.rolePermissions
        },
        role: item.role,
        module: item.module
      }
      await  axios.post(`${baseUrl}rolePermissions/createItem`, data, config)
      .then((response) => {
        dispatch({
          type: types.addItem,
          item
        })
    
        dispatch(getItems())
        resolve(response)
      })
      } catch (error) {
        console.log(error)
         reject(error)
      }
    })
    
  }
}

// ** Add new item
export const addData = (item) => {
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
            ability: typesAbilities.created,
            subject: typesModules.rolePermissions
        },
       item
      }
      await  axios.post(`${baseUrl}rolePermissions/createData`, data, config)
      .then((response) => {
        dispatch({
          type: types.addItem,
          item
        })
    
        dispatch(getItems())
        resolve(response)
      })
      } catch (error) {
        console.log(error)
         reject(error)
      }
    })
    
  }
}

export const udpateItem = (item, roleId) => {
  return (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      try {
   
        const data = {
          dataUser: {
            userId: getState().auth.userData.id,
            ability: typesAbilities.updated,
            subject: typesModules.rolePermissions

        },
        item
      }
        await axios.put(`${baseUrl}rolePermissions/updateData`, data)
      .then((response) => {
        dispatch(addSelectedPermissions(roleId))

        dispatch(getModules())
    
        dispatch({
          type: types.updateItem
        })
        dispatch({
          type: types.delItemSelected
        })
         resolve(response)
      })
      } catch (error) {
         console.log(error)
         reject(error)
      }
      
    })
  }
}


// ** Delete user
export const deleteItem = (id) => {
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
          ability: typesAbilities.deleted,
          subject: typesModules.rolePermissions
      }}
      await  axios
      .post(`${baseUrl}rolePermissions/deleteItem/${id}`, data, config)
      .then((response) => {
        dispatch({
          type: types.deleteItem
        })
        dispatch(getItems())
        
        resolve(response)
      })
      } catch (error) {
         reject(error)
      }
    })
  }
}

export const deleteData = (item) => {
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
          ability: typesAbilities.deleted,
          subject: typesModules.rolePermissions
      }, 
      item
    }
      await  axios
      .post(`${baseUrl}rolePermissions/deleteData`, data, config)
      .then((response) => {
        dispatch({
          type: types.deleteItem
        })
        dispatch(getItems())
        
        resolve(response)
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
      .post(`${baseUrl}rolePermissions/clone`, { id })
      .then((response) => {
        dispatch(setEditOn(Math.random(), response.data.items))
      })
      .then(() => {
        dispatch(getData(getState().programs.params))
      })
  }
}

