import classnames from 'classnames'
import Avatar from '@components/avatar'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'
import { Fragment, useState, useEffect, useMemo } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useOptionsSelectYears } from '../../../../utility/hooks/useOptionsSelectYears'
import { useForm } from 'react-hook-form'
import { getServerInstance, getUserData, isObjEmpty, isTokenActive, isUserLoggedIn } from '../../../../utility/Utils'
import { useDispatch, useSelector } from 'react-redux'
import { updateLogin } from '@store/actions/auth'
import { getStudentsByYear } from '../store/action'

// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Redirect, useHistory } from 'react-router-dom'

const MySwal = withReactContent(Swal)
const defaultValues = {
  year: ''
}

const StatsCard = ({ cols, dataStudent }) => {
  const storeUserData = useSelector(state => state.auth.userData || {})
  const dispatch = useDispatch()
  const [yearOptions, setYearOptions] = useState({ value: '', label: 'Seleccione año...' })
  const optionsYears = useOptionsSelectYears(7, true)
  const [yearRes, setYearRes] = useState(null)
  const [currentInstance, setCurrentInstance] = useState('')
  const isTokenValid = useMemo(() => isTokenActive())
  const history = useHistory()

 
  useEffect(() => {
    const instance = getServerInstance()
    if (instance) setCurrentInstance(instance.name)

    if (isUserLoggedIn() && isObjEmpty(storeUserData)) {
      dispatch(updateLogin(getUserData()))
    }
    return () => {
      setYearOptions(null)
      setYearRes(null)
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(getStudentsByYear(yearOptions.value))
      .then((response) => {
        console.log(response)
        const data = JSON.parse(response.data)

        if (data.total) setYearRes(data.total)
        if (data.totalcount) setYearRes(data.totalcount)

        if (!isTokenValid) {
          MySwal.fire({
            title: "Error!",
            html: `Usuario no autorizado, o su sesión caducó, por favor inicie sesión nuevamente.`,
            icon: "error",
            buttonsStyling: true,
            showConfirmButton: false
            }).then(() => {
              history.push("/logout")
            })
        }
      }).catch(error => {
        console.log("Error", error)
        MySwal.fire({
          title: "Error!",
          html: `Ocurrió un error inesperado. <br><br><p>${error.status}</p>`,
          icon: "error",
          buttonsStyling: true,
          showConfirmButton: false
          })
        if (error.status === 401) {
        }

      })


  }, [yearOptions])

  const handleYear = (e) => {
    setYearOptions(e)
  }

  const data = [
    {
      title: yearRes,
      subtitle: 'Total Alumnos',
      color: 'light-primary',
      icon: <User size={24} />
    },
    {
      title: dataStudent.totalDesertions,
      subtitle: 'Total Deserción',
      color: 'light-info',
      icon: <User size={24} />
    },
    {
      title: '1.423k',
      subtitle: 'Products',
      color: 'light-danger',
      icon: <Box size={24} />
    },
    {
      title: '$9745',
      subtitle: 'Revenue',
      color: 'light-success',
      icon: <DollarSign size={24} />
    }
  ]


  const renderData = () => {
    return data.map((item, index) => {
      const margin = Object.keys(cols)
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
          })}
        >
          <Media>
            <Avatar color={item.color} icon={item.icon} className='mr-2' />
            <Media className='my-auto' body>
              <h4 className='font-weight-bolder mb-0'>{item.title}</h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </Media>
          </Media>
        </Col>
      )
    })
  }

  return (
    <Fragment>
      {/* {(!isTokenValid) && <Redirect to="/logout" />} */}
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filtrar</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={optionsYears}
                value={yearOptions}
                onChange={e => handleYear(e)}
              />
            </Col>

          </Row>
        </CardBody>
      </Card>
      <Card className='card-statistics'>
        <CardHeader>
          <CardTitle tag='h4'>Estadísticas</CardTitle>
          <CardText className='card-text font-weight-bolder mr-25 mb-0'>Instance: {currentInstance}</CardText>
        </CardHeader>
        <CardBody className='statistics-body'>
          <Row>{renderData()}</Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default StatsCard
