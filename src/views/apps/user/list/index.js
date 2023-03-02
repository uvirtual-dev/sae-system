// ** User List Component
import Table from './Table'

// ** Styles
import '@styles/react/apps/app-users.scss'

import { useIsLogued } from '../../../../utility/hooks/useIsLogued'
import ErrorBoundary from '../../../../utility/error.boundary'


const UsersList = () => {
  const [isLogued, userLogued, userLogout] = useIsLogued(true)
  return (
    <div className='app-user-list'>
      <ErrorBoundary>
        <Table isLogued={isLogued} userLogued={userLogued} userLogout={userLogout}/>
      </ErrorBoundary>
    </div>
  )
}

export default UsersList
