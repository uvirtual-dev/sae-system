import { types } from "../types"

// ** Initial State
export const initialState = {
  data: [],
  allData: [],
  params: {},
  selectedItem: {}
}

const items = (state = initialState, action) => {
 // return { ...state, data: action.data, total: action.totalPages, params: action.params }

  switch (action.type) {
    case types.getData:
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
  
      }
    case types.getItems:
      return {
        ...state,
        allData: action.payload
  
      }
    case types.addItemSelected:
      return { ...state, selectedItem: action.payload}
    case types.delItemSelected:
      return { ...state, selectedItem: {} }
    case types.addItem:
      return { ...state}
    case types.updateItem:
      return { ...state}
    case types.deleteItem:
      return { ...state}
  
    default:
      return { ...state }
  }
}
export default items
