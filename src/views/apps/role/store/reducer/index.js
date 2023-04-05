import { types } from "../types"

// ** Initial State
export const initialState = {
  data: [],
  allData: [],
  params: {},
  selectedItem: {},
  selectedPermissions: []

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
        allData: action.payload
      }
    case types.addItemSelected:
      return { ...state, selectedItem: action.payload }
    case types.delItemSelected:
      return { ...state, selectedItem: {} }
    case types.addPermissionsSelected:
      return { ...state, selectedPermissions: action.payload }
    case types.delPermissionsSelected:
      return { ...state, selectedPermissions: [] }
    case types.addItem:
      return { ...state }
    case types.updateItem:
      return { ...state }
    case types.deleteItem:
      return { ...state }
    default:
      return { ...state }
  }
}
export default items
