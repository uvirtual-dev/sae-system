import React from 'react'
import BlankLayout from '../../../../@core/layouts/BlankLayout'
import ErrorBoundary from '../../../../utility/error.boundary'
import ItemEdit from './Edit'

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