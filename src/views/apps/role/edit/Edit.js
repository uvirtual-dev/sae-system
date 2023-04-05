// ** React Imports
import { useEffect, useMemo } from "react"
import { useParams, Link, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"


// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Utils
import { isObjEmpty, getUserData, isUserLoggedIn, isTokenActive } from '../../../../utility/Utils' //from '@utils'
import "@styles/react/libs/flatpickr/flatpickr.scss"
import '@styles/react/libs/react-select/_react-select.scss'
// import "@styles/react/modules/app-general.scss"

// ** Components
import { Button, FormGroup, Label, Card, CardBody, Form, Input, Alert, Col, Row, Breadcrumb, BreadcrumbItem } from "reactstrap"
import BlankLayout from "../../../../@core/layouts/BlankLayout"


// ** Store & Actions
import { getRole, updateRole } from "../store/action"
import { updateLogin } from '@store/actions/auth'
import { useForm } from "react-hook-form"

import { yupResolver } from '@hookform/resolvers/yup'
import { SignupSchema } from "../schemaForm"
import handleError from "../../../../utility/handle.error"

const defaultValues = {
    name: ''
}

const ItemEdit = (props) => {
    const { register, formState: { errors }, reset, clearErrors, handleSubmit, watch, control, setValue } = useForm({ mode: 'onChange', resolver: yupResolver(SignupSchema), defaultValues })

    const store = useSelector((state) => state.role || {})
    const storeUserData = useSelector(state => state.auth.userData || {})
    const dispatch = useDispatch()
    const isTokenValid = useMemo(() => isTokenActive())

    const { id } = useParams()
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

    }, [dispatch])


    useEffect(() => {
        if (!isObjEmpty(store.selectedItem)) {
            setValue("name", store.selectedItem.name)
        }

    }, [store.selectedItem])

    // ** Function to handle form submit
    const onSubmit = (values) => {

        values["id"] = id
          dispatch(updateRole(values, props))
          .then((response, reject) => {
            if (response.status === 200) {
              MySwal.fire({
                title: "Se actualizaron los registros.",
                icon: "info",
                buttonsStyling: true,
                confirmButtonText: "Ok"
              })
              history.push('/apps/role/list')
            } 
          })
          .catch((error) => {
            const { message, status } = handleError(error)
            const msgHtml = (status === 401 || status === 403) ? `Por favor inicie sesión! <br>. <p class="text-danger">${message}<p>` : `Por favor actualice la página! <br>. <p class="text-danger">${message}<p>`
             MySwal.fire({
                 title: `Error! ${status}`,
                 html: msgHtml,
                 icon: "error",
                 buttonsStyling: true,
                 showConfirmButton: false
             })
          })

    }

    return store.selectedItem !== null && store.selectedItem !== undefined ? (
        <BlankLayout>
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to='#'> Inicio </Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    <Link to='/apps/roles/list'>Roles</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    Editar Rol
                </BreadcrumbItem>
            </Breadcrumb>
            <Row>
                <Col sm="12">
                    <Card>
                        <CardBody className="pt-2">
                            <Card>
                                <CardBody>
                                    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                                        <Row>
                                            <Col md='12' sm='6'>
                                                <FormGroup>
                                                    <Label for="name">Nombre<span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="name"
                                                        id="name"
                                                        autoComplete='off'
                                                        control={control}
                                                        onChange={(e) => setValue("name", e.target.value)}
                                                        value={watch('name') || ''}
                                                        placeholder="Nombre"
                                                        innerRef={register({})}
                                                        invalid={errors.name && true}
                                                    />
                                                    {(errors.name && true) && <small className='text-danger'>{errors.name.message}</small>}
                                                </FormGroup>
                                            </Col>

                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button
                                                    type="submit"
                                                    className="mr-2"
                                                    color="primary"
                                                >
                                                    Guardar
                                                </Button>
                                                <Button
                                                    type="button"
                                                    color="secondary"
                                                    outline
                                                ><Link to='/apps/role/list'>
                                                        Cancelar
                                                    </Link>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </BlankLayout>
    ) : (
        <BlankLayout>
            <Alert color="danger">
                <h4 className="alert-heading">No se encuentra el registro</h4>
                <div className="alert-body">
                    El item con el id : {id} no existe, por favor buscalo en :{" "}
                    <Link to="/apps/role/list">la lista de items</Link>
                </div>
            </Alert>
        </BlankLayout>
    )
}
export default ItemEdit
