import React from 'react'
import TableList from './Table'

// import '@styles/react/apps/app-general.scss'
import BlankLayout from '../../../../@core/layouts/BlankLayout'
import { useIsLogued } from '../../../../utility/hooks/useIsLogued'
import ErrorBoundary from '../../../../utility/error.boundary'

const index = () => {
    const [isLogued, userLogued, userLogout] = useIsLogued(true)

    return (
        <BlankLayout>
            <ErrorBoundary>
                <TableList isLogued={isLogued} userLogued={userLogued} userLogout={userLogout} />
            </ErrorBoundary>
        </BlankLayout>
    )
}
export default index

