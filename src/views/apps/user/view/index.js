import React, { Fragment } from 'react'
import ErrorBoundary from '../../../../utility/error.boundary'
import ItemView from './View'

const index = () => {
  return (
    <Fragment>
        <ErrorBoundary>
            <ItemView />
        </ErrorBoundary>
    </Fragment>
  )
}

export default index