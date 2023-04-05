import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

//Components
import ErrorBoundary from '../../../../utility/error.boundary'
import Dashboard from './Dashboard'

//Utils
import { getServerInstance, isObjEmpty, isTokenActive } from '../../../../utility/Utils'

// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

const Index = () => {
  const [selectPlatform, setSelectPlatform] = useState(true)
  const instanceLocal = getServerInstance()
  const instance = useSelector(state => state.instance.selectedItem)

  useEffect(() => {
    if (instanceLocal === null) {
      setSelectPlatform(false)

      MySwal.fire({
        title: "Sin acceso!",
        html: "Por favor, primero seleccione la plataforma.",
        icon: "info",
        buttonsStyling: true,
        confirmButtonText: "Ok"
      })
    } else {
      setSelectPlatform(true)
    }

  }, [instanceLocal, selectPlatform])


  return (selectPlatform && instanceLocal && instanceLocal !== null && instanceLocal !== undefined) ? (
    <Fragment>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </Fragment>
  ) : <Redirect to="/apps/instance/view" />
}
export default Index
