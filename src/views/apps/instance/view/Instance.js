import React, { useEffect, useState, useMemo } from 'react'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

//Components
import BlankLayout from '../../../../@core/layouts/BlankLayout'
import StatsVertical from '@components/widgets/stats/StatsVertical'
import { Card, CardHeader, CardTitle, CardBody, Row, Col } from 'reactstrap'
import { Globe } from 'react-feather'

//Actions
import { getInstance, getInstances } from '../store/action'
import { updateLogin } from '@store/actions/auth'

//Utils
import { getUserData, isObjEmpty, isTokenActive, isUserLoggedIn, setServerInstance } from '../../../../utility/Utils'

//SWAL
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

//Style
import '@styles/react/libs/swiper/swiper.scss'

const Instance = (props) => {
    const storeUserData = useSelector(state => state.auth.userData || {})
    const store = useSelector(state => state.instance || [])
    const dispatch = useDispatch()
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
          if (isUserLoggedIn() && isObjEmpty(storeUserData)) dispatch(updateLogin(getUserData()))
          return () => {
            setRedirect(null)
          }
    }, [dispatch, store.data.length])

    useEffect(() => {
        dispatch(getInstances())
            .catch((error) => {
                if (error.status === 401) {
                        MySwal.fire({
                        title: "Error!",
                        html: `Usuario no autorizado, o su sesión caducó, por favor inicie sesión nuevamente. <br> <br><p class="text-danger">${error.statusText}</p>`,
                        icon: "error",
                        buttonsStyling: true,
                        showConfirmButton: false
                        })
                }
            })
            return () => {
                setRedirect(null)
            }
    }, [dispatch, store.data.length])

    const token = useMemo(() => isTokenActive())

    if (!token) return <Redirect to="/logout"/>
       

    const handleClic = (e) => {
        if (e.target.id !== '') {
            dispatch(getInstance(e.target.id, props))
                .then((response) => {
                    setServerInstance(response.data)
                    setRedirect(true)
                }).catch((error) => {
                        MySwal.fire({
                            title: "Error!",
                            text: error,
                            html: `${error} <p><h2>Por favor actualiza la página </h2></p>`,
                            icon: "error",
                            buttonsStyling: true,
                            showConfirmButton: false
                        })
                })
        }
    }

    return (!redirect) ? (
        <BlankLayout>
            <Card className='bg-transparent shadow-none'>
                <CardHeader>
                    <CardTitle tag='h4'>Seleccione Plataforma</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row>
                        {
                            (store && storeUserData.isAdmin) ? (
                                store.allData.map((row, index) => {
                                    return (
                                        <Col xl='2' md='4' sm='6' key={row.name}>
                                            <StatsVertical
                                                key={row._id}
                                                id={row._id}
                                                icon={<Globe id={row._id} onClick={handleClic} size={34} />} color='info' stats={row.name} statTitle='' />
                                        </Col>

                                    )

                                })) : (
                                store.allData.map((row, index) => {
                                    return (
                                        (!row.isAdmin) && (
                                            <Col xl='2' md='4' sm='6' key={row.name}>
                                                <StatsVertical
                                                    key={row._id}
                                                    id={row._id}
                                                    icon={<Globe id={row._id} onClick={handleClic} size={34} />} color='info' stats={row.name} statTitle='' />
                                            </Col>
                                        )
                                    )

                                })
                            )
                        }
                    </Row>
                </CardBody>
            </Card>
        </BlankLayout>
    ) : <Redirect to="/apps/dashboard/view" />
}
export default Instance

