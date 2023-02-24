import React, { Fragment, useEffect }  from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

//Components
import ErrorBoundary from '../../../../utility/error.boundary'
import Instance from './Instance'

//Utils
import { deleteServerInstance } from '../../../../utility/Utils'

//Actions
import { delSelectedInstance } from '../store/action'
import BlankLayout from '../../../../@core/layouts/BlankLayout'


const index = (props) => {
  const dispatch = useDispatch()
  const {id} = useParams()

  useEffect(() => {
    if (id === '2') {
      deleteServerInstance()
      dispatch(delSelectedInstance())
    } 
  }, [id])

  return (
    <BlankLayout>
      <ErrorBoundary>
        <Instance props={props} />
      </ErrorBoundary>
    </BlankLayout>
  ) 
}

export default index