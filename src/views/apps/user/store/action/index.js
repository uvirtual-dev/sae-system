import axios from "axios"
import themeConfig from "@configs/themeConfig"
import { types } from "../types"
import { typesModules, typesAbilities, isUserLoggedIn } from "../../../../../utility/Utils"

// const baseUrl = themeConfig.apiUrl
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

export const delSelectedItem = () => {
  return async (dispatch) => {
    dispatch({
      type: types.delItemSelected
    })
  }
}

export const getData = (params) => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
        
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
                      params
                    })
                    resolve(response)
                }).catch((error) => {
                  reject(error)
                })

     })
                
   }
 
}

// ** Get data on page or row change
export const getItems = () => {
  return async (dispatch, getState) => {
    return new Promise(async(resolve, reject) => {
      try {
    
      const data = {
            dataUser: {
              userId: getState().auth.userData.id,
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
                subject: typesModules.user
            }
          }
          console.log(config, data)
          await axios.post(`${baseUrl}user/getItem/${id}`, data, config)
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
      console.log("SUCEDE", item)
      await  axios.post(`${baseUrl}user/createItem`, item, config)
      .then((response) => {
        dispatch({
          type: types.addItem,
          item
        })
        dispatch(getData(getState().user.params))
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
        await axios.put(`${baseUrl}user/updateItem/${item.id}`, item, config)
      .then((response) => {
        if (props.history) {
          props.history.push(`/apps/user/list`)
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
          subject: typesModules.user
      },
      id
    }
      await  axios
              .post(`${baseUrl}user/deleteItem/${id}`, data, config)
              .then((response) => {
                  dispatch({
                    type: types.deleteItem
                  })
                  dispatch(getData(getState().user.params))
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
        dispatch(getData(getState().programs.params))
      })
  }
}

