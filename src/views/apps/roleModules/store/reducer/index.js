import { types } from "../types"

// ** Initial State
export const initialState = {
  data: [],
  params: {},
  selectedItem: {},
  newData: {}
}

const items = (state = initialState, action) => {
  switch (action.type) {
    case types.getData:
      return {
        ...state,
        data: action.payload
      }
    case types.getItems:
      return {
        ...state,
        data: action.payload
      }
    case types.deleteData:
      return {
        ...state,
        data: []
      }
    case types.addItemSelected:
      return { ...state, selectedItem: action.payload }
    case types.delItemSelected:
      return { ...state, selectedItem: {} }
    case types.addItem:
      return { ...state }
    case types.updateItem:
      return { ...state }
    case types.deleteItem:
      return { ...state }
    case types.addDataNew:
      return { ...state, newData: action.payload }
    case types.delDataNew:
      return { ...state, newData: {} }

    default:
      return { ...state }
  }
}
export default items
