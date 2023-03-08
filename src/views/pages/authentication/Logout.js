import { useEffect} from 'react'

import { useDispatch } from 'react-redux'

import { Redirect } from 'react-router-dom'

import '@styles/base/pages/page-auth.scss'
import { handleLogout } from '../../../redux/actions/auth'


const Logout = props => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(handleLogout())
  }, [dispatch])
  
  return (
   <Redirect to = "/login" />
  )
}

export default Logout
