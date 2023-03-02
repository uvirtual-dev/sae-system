import axios from "axios"
import { types } from "../types"

import { typesModules, typesAbilities, getServerInstance } from "../../../../../utility/Utils"

const baseUrl = `${process.env.REACT_APP_API_URL}/api/`


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

export const deleteData = () => {
  return async (dispatch) => {
    dispatch({
      type: types.deleteData
    })
  }
}

// ** Get data on page or row change
export const getStudentsByYear = (year) => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      const instance = getServerInstance()
        if (instance === null) return  
        const paramYear = (year) ? `&year=${year}` : ''
        await axios.post(`${instance.url}/webservice/rest/server.php?wstoken=${instance.token}&wsfunction=local_uvirtual_get_users_count&moodlewsrestformat=json${paramYear}`)
                    .then((response) => {
                          dispatch({
                            type: types.getStudentsByYear,
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
                subject: typesModules.roleModules

            }
          }
          await axios.post(`${baseUrl}roleModules/getItem/${id}`, data, config)
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
          subject: typesModules.roleModules

      },
      name: item.name
    }
      await  axios.post(`${baseUrl}roleModules/createItem`, data, config)
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


export const udpateItem = (item, props) => {
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
            ability: typesAbilities.updated,
            subject: typesModules.roleModules
        },
        id: item.id,
        name: item.name
      }
        await axios.put(`${baseUrl}roleModules/updateItem/${item.id}`, data, config)
      .then((response) => {
        if (props.history) {
          props.history.push(`/apps/roleModules/list`)
        }
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
          ability: typesAbilities.updated,
          subject: typesModules.roleModules
      },
      id
    }

      await  axios
      .post(`${baseUrl}roleModules/deleteItem/${id}`, data, config)
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
      .post(`${baseUrl}roleModules/clone`, { id })
      .then((response) => {
        dispatch(setEditOn(Math.random(), response.data.items))
      })
      .then(() => {
        dispatch(getData(getState().programs.params))
      })
  }
}

