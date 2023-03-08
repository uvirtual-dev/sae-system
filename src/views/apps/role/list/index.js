import React from 'react'
import TableList from './Table'
import CustomFooter from '../../../../layouts/components/Footer'

// import '@styles/react/apps/app-general.scss'
import BlankLayout from '../../../../@core/layouts/BlankLayout'
import { useIsLogued } from '../../../../utility/hooks/useIsLogued'

const index = () => {
    const [isLogued, userLogued, userLogout] = useIsLogued(true)

    return (
        <BlankLayout>
           <TableList isLogued={isLogued} userLogued={userLogued} userLogout={userLogout}/>
        </BlankLayout>
    )
}
export default index

