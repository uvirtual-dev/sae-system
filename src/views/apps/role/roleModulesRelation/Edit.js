// ** React Imports
import { useState, useEffect, useMemo } from "react"
import { useParams, Link, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Utils
import { isObjEmpty, getUserData, isUserLoggedIn, isTokenActive } from '../../../../utility/Utils' //from '@utils'
import "@styles/react/libs/flatpickr/flatpickr.scss"
// import "@styles/react/apps/app-general.scss"
import '@styles/react/libs/react-select/_react-select.scss'

// Components
import { Card, CardBody, CustomInput, Alert, FormGroup, Button, Form, Row, Col, Label, Breadcrumb, BreadcrumbItem } from "reactstrap"
import BlankLayout from "../../../../@core/layouts/BlankLayout"
import { Unlock } from 'react-feather'


// Actions && Hooks
import { updateLogin } from '@store/actions/auth'
import { addSelectedPermissions, getRole } from "../store/action"
import { getRoleModules } from '../../roleModules/store/action'
import { addData, deleteData } from '../../rolePermissions/store/action'
import { useForm } from "react-hook-form"
import handleError from "../../../../utility/handle.error"


const ItemEdit = (props) => {

    // state & Hooks
    const store = useSelector((state) => state.role || [])
    const storeModules = useSelector((state) => state.roleModules || [])
    const storeUserData = useSelector(state => state.auth.userData || [])
    const { register, formState: { errors }, reset, clearErrors, handleSubmit, watch, control, setValue } = useForm({})
    const [isButtonAllowed, setIsButtonAllowed] = useState(true)
    const [isButtonModule, setIsButtonModule] = useState(true)

    const { id } = useParams()
    const dispatch = useDispatch()
    const isTokenValid = useMemo(() => isTokenActive())
    const history = useHistory()


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
            dispatch(getRole(id))
            dispatch(getRoleModules())
            dispatch(addSelectedPermissions(id, 'module'))
        }

    }, [dispatch])

    const dispatchers = () => {

        dispatch(addSelectedPermissions(id, 'module'))
            .then(() => {
                dispatch(getRole(id))
                dispatch(getRoleModules())
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

    const setters = () => {
        setIsButtonModule(true)
        setIsButtonAllowed(true)
    }

    const onSubmit = (values) => {
        console.log(values)
        const data = []
        if (values.modules) {
            values.modules.forEach(element => {
                data.push({
                    role: id,
                    module: element
                })
            })
            dispatch(addData(data))
                .then((response) => {
                    dispatchers()
                    setters()
                })
        }

        if (values.allowed) {
            values.allowed.forEach(element => {
                data.push({
                    id: element
                })
            })
            dispatch(deleteData(data))
                .then((response) => {
                    dispatchers()
                    setters()
                })
        }

    }

    const handleChange = (e) => {
        if (e.target.name === 'modules') {
            setIsButtonModule(false)
            setIsButtonAllowed(true)

            setValue('allowed', [])

        }
        if (e.target.name === 'allowed') {
            setIsButtonAllowed(false)
            setIsButtonModule(true)
            setValue('modules', [])
        }
    }

    return store.selectedItem !== null && store.selectedItem !== undefined ? (
        <BlankLayout>
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to='#'> Inicio </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link to='/apps/role/list'> Rol </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <span> Editar Relaciones con Módulos </span>
                </BreadcrumbItem>
            </Breadcrumb>
            <Card>
                <CardBody >
                    <Row>
                        <Col md='2' sm='2' xs="2">
                            <h3 className='font-weight-bolder'>Rol:</h3>
                        </Col>
                        <Col md='8' sm='8' xs="8">
                            <h3 className='font-weight-normal'>{store.selectedItem.name}</h3>
                        </Col>
                        <Col md='2' sm='2' xs="2">
                            <div className="float-right p-2">
                                <FormGroup>
                                    <Button.Ripple outline color='primary'>
                                        <Link
                                            to={`/apps/role/editPermissions/${id}`}
                                            className="user-name text-truncate mb-0"
                                        >
                                            <Unlock size={14} />
                                            <span className='align-middle ml-25'>Editar Permisos</span>
                                        </Link>
                                    </Button.Ripple>
                                </FormGroup>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md='5' sm='5' xs="5">
                            <Form id="formAllowed" onSubmit={handleSubmit(onSubmit)} >
                                <FormGroup>
                                    <Label for='custom-select-size'>Módulos permitidos</Label>
                                    <CustomInput
                                        type='select'
                                        name='allowed'
                                        id='custom-select-size'
                                        size={15}
                                        multiple
                                        innerRef={register({ required: false })}
                                        onChange={(e) => handleChange(e)}
                                    >
                                        {
                                            store.selectedPermissions.map((item) => <option key={item._id} id={item._id} value={item._id}>{item.module.name}</option>)
                                        }
                                    </CustomInput>
                                </FormGroup>
                            </Form>

                        </Col>
                        <Col md='2' sm='2' xs="2">
                            <div className="float-center p-2">
                                <Button
                                    type="submit"
                                    form="formModules"
                                    className="mr-2"
                                    color="primary"
                                    disabled={isButtonModule}
                                >
                                    {'<<<'}
                                </Button>
                            </div>
                            <div className="float-center p-2">
                                <Button
                                    type="submit"
                                    form="formAllowed"
                                    className="mr-2"
                                    color="primary"
                                    disabled={isButtonAllowed}
                                >
                                    {'>>>'}
                                </Button>
                            </div>

                        </Col>
                        <Col md='5' sm='5' xs="5">
                            <Form id="formModules" onSubmit={handleSubmit(onSubmit)} >
                                <FormGroup>
                                    <Label for='custom-select-size'>Módulos</Label>
                                    <CustomInput
                                        type='select'
                                        name='modules'
                                        id='custom-select-size'
                                        size={15}
                                        multiple
                                        innerRef={register({ required: false })}
                                        onChange={(e) => handleChange(e)}
                                    >
                                        {
                                            storeModules.data.map(item => (
                                                store.selectedPermissions.find(item2 => item2.module._id === item._id) ? null : <option key={item._id} value={item._id}>{item.name}</option>
                                            ))
                                        }
                                    </CustomInput>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="float-right p-2">

                                <Button
                                    type="button"
                                    color="secondary"
                                    outline
                                ><Link to='/apps/role/list'>
                                        Cancelar
                                    </Link>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>


        </BlankLayout>
    ) : (
        <BlankLayout>
            <Alert color="danger">
                <h4 className="alert-heading">No se encuentra el registro</h4>
                <div className="alert-body">
                    El item con el id : {id} no existe.
                    <Link to="/apps/role/list">la lista de items</Link>
                </div>
            </Alert>
        </BlankLayout>
    )
}
export default ItemEdit
