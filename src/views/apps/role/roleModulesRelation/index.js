import React from 'react'
import BlankLayout from '../../../../@core/layouts/BlankLayout'
import ItemEdit from './Edit'
import ErrorBoundary from '../../../../utility/error.boundary'

const index = (props) => {
  return (
    <BlankLayout>
      <ErrorBoundary>
        <ItemEdit props={props} />
      </ErrorBoundary>
    </BlankLayout>
  )
}

export default index