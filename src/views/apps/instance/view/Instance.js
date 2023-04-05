import React, { useEffect, useState, useMemo } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

//Components
import BlankLayout from '../../../../@core/layouts/BlankLayout'
import StatsVertical from '@components/widgets/stats/StatsVertical'
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Button } from 'reactstrap'
import { Edit, Globe, Trash } from 'react-feather'

//Actions
import { delSelectedInstance, deleteInstance, getInstance, getInstances } from '../store/action'
import { updateLogin } from '@store/actions/auth'

//Utils
import { deleteServerInstance, getServerInstance, getUserData, isObjEmpty, isTokenActive, isUserLoggedIn, setServerInstance } from '../../../../utility/Utils'

//SWAL
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)
import { Can } from '../../../../utility/context/Can'

//Style
import '@styles/react/libs/swiper/swiper.scss'
import ErrorBoundary from '../../../../utility/error.boundary'
import { ModalNewItem } from './ModalNewItem'
import { useModal } from '../../../../utility/hooks/useModal'

const Instance = (props) => {
    const storeUserData = useSelector(state => state.auth.userData || {})
    const store = useSelector(state => state.instance || [])
    const dispatch = useDispatch()
    const [redirect, setRedirect] = useState(false)
    const [isOpenModal, openModal, closeModal] = useModal(false)
    const isTokenValid = useMemo(() => isTokenActive())

    useEffect(() => {
        if (isUserLoggedIn() && isObjEmpty(storeUserData)) dispatch(updateLogin(getUserData()))
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
        } else {
            dispatch(getInstances())
                .then(() => {
                    if (!isObjEmpty(store.selectedItem) || getServerInstance() !== null || getServerInstance() !== undefined) {
                        deleteServerInstance()
                        dispatch(delSelectedInstance())
                    }
                })
                .catch((error) => {
                    const { message, status } = handleError(error)
                    const msgHtml = (status === 401 || status === 403) ? `Sucedió un error con la petición! <br>. <p class="text-danger">${message}<p>` : `Por favor actualice la página! <br>. <p class="text-danger">${message}<p>`
                    MySwal.fire({
                        title: `Error! ${status}`,
                        html: msgHtml,
                        icon: "error",
                        buttonsStyling: true,
                        showConfirmButton: false
                    })
                })

        }

        return () => {
            setRedirect(null)
        }
    }, [dispatch, store.data.length])

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
            <Can I="create" a="instance">
                <Card>
                    <CardHeader>
                        <CardTitle tag='h4'>Formulario de Instancias</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md='12'>
                                <div className="float-right">
                                    <Button.Ripple color='primary' onClick={openModal} key={4} outline>
                                        Agregar
                                    </Button.Ripple>
                                    <ErrorBoundary>
                                        <ModalNewItem isOpen={isOpenModal} closeModal={closeModal} props={props} />
                                    </ErrorBoundary>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Can>
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
                                            <Row>
                                                <Col>
                                                    <Link
                                                        to={`/apps/instance/edit/${row._id}`}
                                                        className="user-name text-truncate mb-0"
                                                    >
                                                        <Button.Ripple className='btn-icon rounded-circle' color='flat-primary'>
                                                            <Edit size={20} />
                                                        </Button.Ripple>
                                                    </Link>
                                                </Col>
                                                <Col>
                                                    <div className="float-right">
                                                        <Button.Ripple
                                                            className='btn-icon rounded-circle' color='danger'
                                                            outline
                                                            onClick={(e) => {
                                                                MySwal.fire({
                                                                    title: "¿Quieres borrar este item?",
                                                                    icon: "info",
                                                                    showCancelButton: true,
                                                                    customClass: {
                                                                        confirmButton: "btn btn-danger mr-2",
                                                                        cancelButton: "btn btn-primary mr-2"
                                                                    },

                                                                    buttonsStyling: true,
                                                                    confirmButtonText: "Si, Borrarlo",
                                                                    cancelButtonText: "Cancelar"
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        dispatch(deleteInstance(row._id))
                                                                    } else if (result.isDenied) {
                                                                        MySwal.fire("Changes are not saved", "", "info")
                                                                    }
                                                                })
                                                            }}
                                                        >
                                                            <Trash size={15} />
                                                        </Button.Ripple>
                                                    </div>
                                                </Col>
                                            </Row>
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
                                                <Row>
                                                    <Col>
                                                        <Can I="update" a="instance">
                                                            <Link
                                                                to={`/apps/instance/edit/${row._id}`}
                                                                className="user-name text-truncate mb-0"
                                                            >
                                                                <Button.Ripple className='btn-icon rounded-circle' color='flat-primary'>
                                                                    <Edit size={20} />
                                                                </Button.Ripple>
                                                            </Link>
                                                        </Can>
                                                    </Col>
                                                    <Col>
                                                        <div className="float-right">
                                                            <Can I="delete" a="instance">
                                                                <Button.Ripple
                                                                    className='btn-icon rounded-circle' color='danger'
                                                                    outline
                                                                    onClick={(e) => {
                                                                        MySwal.fire({
                                                                            title: "¿Quieres borrar este item?",
                                                                            icon: "info",
                                                                            showCancelButton: true,
                                                                            customClass: {
                                                                                confirmButton: "btn btn-danger mr-2",
                                                                                cancelButton: "btn btn-primary mr-2"
                                                                            },

                                                                            buttonsStyling: true,
                                                                            confirmButtonText: "Si, Borrarlo",
                                                                            cancelButtonText: "Cancelar"
                                                                        }).then((result) => {
                                                                            if (result.isConfirmed) {

                                                                                dispatch(deleteInstance(row._id))
                                                                            } else if (result.isDenied) {
                                                                                MySwal.fire("Changes are not saved", "", "info")
                                                                            }
                                                                        })
                                                                    }}
                                                                >
                                                                    <Trash size={15} />
                                                                </Button.Ripple>
                                                            </Can>
                                                        </div>
                                                    </Col>
                                                </Row>
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

