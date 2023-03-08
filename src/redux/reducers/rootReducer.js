// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import attachment from '@src/views/apps/attachment/store/reducer'
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import user from '@src/views/apps/user/store/reducer'
import role from '@src/views/apps/role/store/reducer'
import roleModules from '@src/views/apps/roleModules/store/reducer'
import rolePermissions from '@src/views/apps/rolePermissions/store/reducer'
import instance from '@src/views/apps/instance/store/reducer'

const rootReducer = combineReducers({
  attachment,
  auth,
  layout,
  navbar,
  role,
  roleModules,
  rolePermissions,
  user,
  instance
})

const rootAppReducer = (state, action) => {
  if (action.type === 'RESET_APP_STATE') {
    state = undefined
  }

  return rootReducer(state, action)
}

export default rootAppReducer
