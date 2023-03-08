import { types } from "../types"

// ** Initial State
export const initialState = {
  studentsByYear: {},
 
}

const items = (state = initialState, action) => {
  switch (action.type) {
    case types.getStudentsByYear:
      return {
        ...state,
        studentsByYear: action.payload
      }
    default:
      return { ...state }
  }
}
export default items
