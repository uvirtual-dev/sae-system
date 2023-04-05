// ** React Imports
import { useEffect, Fragment, useMemo } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from "react-hook-form"

// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { getUser, udpateUser } from '../store/action'
import { updateLogin } from '@store/actions/auth'
import { getRoles } from '../../role/store/action'
// ** Third Party Components
import { Card, CardBody, Row, Col, Button, BreadcrumbItem, Breadcrumb, Alert, Form, FormGroup, Label, Input } from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'

// ** Styles
import makeAnimated from 'react-select/animated'
import { selectThemeColors } from '@utils'
import classnames from "classnames"
import { isObjEmpty, getUserData, isUserLoggedIn, isTokenActive } from '../../../../utility/Utils'
import { useOptionsSelectModules } from '../../../../utility/hooks/useOptionsSelectModules'
import handleError from '../../../../utility/handle.error'


const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: null,
  role: ''
}
const ItemEdit = (props) => {
  // ** States & Vars
  const SignupSchema = yup.object().shape({
    email: yup.string().matches(/^[a-zA-Z0-9._%+-]+@uvirtual\.org$/, 'Debe ser correo @uvirtual.org').email("Debe ser un email válido").required("Campo obligatorio"),
    lastName: yup.string().min(3, "Debe tener mas de 3 caracteres").required("Campo obligatorio"),
    firstName: yup.string().min(3, "Debe tener mas de 3 caracteres").required("Campo obligatorio"),
    password: yup.string(),
    role: yup.object().shape({
      value: yup.string().test('not-empty', 'Campo obligatorio', value => value !== ''),
      label: yup.string()
    }).required('Debe seleccionar un valor')
  })
  const dispatch = useDispatch()
  const history = useHistory()
  const animatedComponents = makeAnimated()

  const { register, formState: { errors }, reset, clearErrors, handleSubmit, watch, control, setValue } = useForm({ mode: 'onChange', resolver: yupResolver(SignupSchema), defaultValues })

  const storeUserData = useSelector(state => state.auth.userData || {})
  const store = useSelector(state => state.user || [])
  const storeRole = useSelector(state => state.role || [])

  const roleOptions = useOptionsSelectModules(storeRole.allData)
  const { id } = useParams()

  const isTokenValid = useMemo(() => isTokenActive())

  useEffect(() => {
    if (storeRole.allData.length === 0) {
      dispatch(getRoles())
    }
  }, [storeRole.allData.length])

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
      dispatch(getUser(id))
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
      const roleSelected = roleOptions.filter((item) => item.value === store.selectedItem.role._id)
      setValue("role", roleSelected[0])
      setValue("firstName", store.selectedItem.firstName)
      setValue("lastName", store.selectedItem.lastName)
      setValue("email", store.selectedItem.email)
    }

  }, [store.selectedItem])

  // ** Function to handle form submit
  const onSubmit = (values) => {

    values["id"] = id
    values["role"] = values["role"].value
    if (values["password"] === "") delete values.password

    dispatch(udpateUser(values))
          .then((response, reject) => {
            if (response.status === 200) {
              MySwal.fire({
                title: "Se actualizaron los registros.",
                icon: "info",
                buttonsStyling: true,
                confirmButtonText: "Ok"
              })
              history.push('/apps/user/list')
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
    <Fragment>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to='#'> Inicio </Link>
        </BreadcrumbItem>
        <BreadcrumbItem >
          <Link to='/apps/user/list'>Usuarios</Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          Editar Usuario
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
                      <Col md='4' sm='4' xs="12">
                        <FormGroup>
                          <Label for="firstName">
                            Nombre <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="firstName"
                            id="firstName"
                            onChange={(e) => setValue("firstName", e.target.value)}
                            value={watch('firstName') || ''}
                            autoComplete="off"
                            placeholder="Nombre"
                            control={control}
                            innerRef={register({})}
                            invalid={errors.firstName && true}
                          />
                          {(errors.firstName && true) && <small className='text-danger'>{errors.firstName.message}</small>}

                        </FormGroup>
                      </Col>
                      <Col md='4' sm='4' xs="12">
                        <FormGroup>
                          <Label for="lastName">
                            Apellido <span className="text-danger">*</span>
                          </Label>
                          <Input
                            name="lastName"
                            id="lastName"
                            onChange={(e) => setValue("lastName", e.target.value)}
                            autoComplete="off"
                            value={watch('lastName') || ''}
                            placeholder="Apellido"
                            control={control}
                            innerRef={register({})}
                            invalid={errors.lastName && true}
                          />
                          {(errors.lastName && true) && <small className='text-danger'>{errors.lastName.message}</small>}

                        </FormGroup>
                      </Col>
                      <Col md='4' sm='4' xs="12">
                        <FormGroup>
                          <Label for="email">
                            e-Mail <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            onChange={(e) => setValue("email", e.target.value)}
                            value={watch('email') || ''}
                            autoComplete="off"
                            placeholder="E-Mail"
                            control={control}
                            innerRef={register({})}
                            invalid={errors.email && true}
                          />
                          {(errors.email && true) && <small className='text-danger'>{errors.email.message}</small>}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md='4' sm='4' xs="12">
                        <FormGroup>
                          <Label for="password">
                            Password <span className="text-danger">*</span>
                          </Label>
                          <InputPasswordToggle
                            id="password"
                            name="password"
                            onChange={(e) => setValue("password", e.target.value)}
                            autoComplete="off"
                            value={watch('password') || ''}
                            placeholder="Password"
                            control={control}
                            innerRef={register({})}
                            invalid={errors.password && true}
                          />
                          {(errors.password && true) && <small className='text-danger'>{errors.password.message}</small>}
                        </FormGroup>
                      </Col>
                      <Col md='4' sm='4' xs="12">
                        <FormGroup>
                          <Label for="role">
                            Rol
                          </Label>
                          <Controller
                            id="role"
                            control={control}
                            rules={{
                              required: true,
                              validate: value => {
                                return value && value.value !== '' // Regla personalizada que devuelve true si el campo es válido y false si el campo es inválido
                              }
                            }}
                            name="role"
                            render={({ value }) => (
                              <Select
                                theme={selectThemeColors}
                                components={animatedComponents}
                                classNamePrefix="select"
                                options={roleOptions}
                                value={watch('role') || value}
                                onChange={val => {
                                  setValue("role", val)
                                }}
                                className={classnames('react-select', { 'is-invalid': (errors.role) || watch('role').value === '' })}
                              />
                            )}
                          />
                          {(errors.role && true) && <small className='text-danger'>{errors.role.message}</small>}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          type="submit"
                          className="mr-1"
                          color="primary"
                        >
                          Guardar
                        </Button>
                        <Button
                          type="button"
                          color="secondary"
                          outline
                        ><Link to='/apps/user/list'>
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
    </Fragment>
  ) : (
    <Fragment>
      <Alert color="danger">
        <h4 className="alert-heading">No se encuentra el registro</h4>
        <div className="alert-body">
          El item con el id : {id} no existe, por favor buscalo en :{" "}
          <Link to="/apps/user/list">la lista de items</Link>
        </div>
      </Alert>
    </Fragment>
  )
}
export default ItemEdit
