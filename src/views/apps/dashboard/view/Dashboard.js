import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col } from 'reactstrap'
import StatsCard from './StatsCard'

//Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'

//Utils
import { getUserData, isObjEmpty, isUserLoggedIn } from '../../../../utility/Utils'

//Actions
import { updateLogin } from '../../../../redux/actions/auth'

//Components
import ErrorBoundary from '../../../../utility/error.boundary'

const Dashboard = (props) => {
  const dispatch = useDispatch()
  const storeUserData = useSelector(state => state.auth.userData || {})

  const dataStudent = {
    totalStudents: 800,
    totalDesertions: 10
  }

  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(storeUserData)) dispatch(updateLogin(getUserData()))
  
  }, [dispatch])

  return (
    <div id='dashboard-ecommerce'>
      <Row className='match-height'>
        <Col xl='12' md='12' xs='12'>
          <ErrorBoundary>
            <StatsCard cols={{ xl: '3', sm: '6' }} dataStudent={dataStudent} />
          </ErrorBoundary>
        </Col>
      </Row>
    </div>
  )
}
export default Dashboard
