// ** React Imports
import { useState, useEffect, Fragment } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from "react-hook-form"

// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'
import { addItem, getItem, udpateItem } from '../store/action'
import { useIsLogued } from '../../../../utility/hooks/useIsLogued'
import { updateLogin } from '@store/actions/auth'
import { getItems as getRoleItems } from '../../role/store/action'
// ** Third Party Components
import { Card, CardBody, Row, Col, Button, CustomInput, BreadcrumbItem, Breadcrumb, TabPane, Alert, Form, FormGroup, Label, Input } from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'

// ** Styles
import makeAnimated from 'react-select/animated'
import { selectThemeColors } from '@utils'
import classnames from "classnames"
import { isObjEmpty, getUserData, isUserLoggedIn, typesAbilities, typesModules } from '../../../../utility/Utils'


const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: '',
  isAdmin: false
}
const ItemEdit = (props) => {
  // ** States & Vars
  const dispatch = useDispatch()
  const animatedComponents = makeAnimated()

  const { register, errors, handleSubmit, control } = useForm({defaultValues})
  
  const stateUserData = useSelector(state => state.auth.userData || {})
  const store = useSelector(state => state.user || [])
  const storeRole = useSelector(state => state.role || [])
  const [isLogued, userLogued, userLogout] = useIsLogued(true)


  //Fields Programs
  const [firstName, setFirstName] = useState(store.selectedItem.firstName || '')
  const [lastName, setLastName] = useState(store.selectedItem.lastName || '')
  const [email, setEmail] = useState(store.selectedItem.email || '')
  const [password, setPassword] = useState(store.selectedItem.password || '')
  const [role, setRole] = useState(store.selectedItem.role || '')
  const [isAdmin, setIsAdmin] = useState(store.selectedItem.role || false)
  const [roleOptions, setRoleOptions] = useState([])

  const  { id } = useParams()

  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(stateUserData)) {
      dispatch(updateLogin(getUserData()))
    }
    
  }, [dispatch, store.data.length])

  useEffect(() => {
    
    if (storeRole.allData.length === 0) {
     dispatch(getRoleItems())
   }
 
}, [dispatch])

  useEffect(() => {
    const options = []
    if (storeRole.allData.length > 0) {
      storeRole.allData.map((item, index) => {
        options.push({ value: item._id, label: item.name })
      })
    }
    setRoleOptions(options)
  
  }, [dispatch, storeRole.allData.length])

  // ** Function to get user on mount
  useEffect(() => {
    dispatch(getItem(id))
  }, [dispatch])

  useEffect(() => {
    if (!isObjEmpty(store.selectedItem)) {
       setFirstName(store.selectedItem.firstName)
       setLastName(store.selectedItem.lastName)
       setEmail(store.selectedItem.email)
       setPassword('')
       const roleSelected = roleOptions.filter((item) => item.value === store.selectedItem.role._id)
       console.log(roleSelected)
       setRole(roleSelected[0])
       setIsAdmin(store.selectedItem.isAdmin)
     } 
  
  }, [store.selectedItem])

  const checkDisabled = () => {
    let disabled = false
   if (firstName === '' || lastName === '' || email === '' || password === '') {
      disabled = true
    }
    return disabled
  }

  const handleChangeInputRole = (val) => {
    setRole(val)
  }
 // ** Function to handle form submit
 const onSubmit = (values) => {
  // if (!isAdmin) {
  //   values["role"] = role
  // }
  values["id"] = id
  values["isAdmin"] = isAdmin
  values["dataUser"] = {
    userId: stateUserData.id,
    ability: typesAbilities.updated,
    subject: typesModules.user
  }
    dispatch(udpateItem(values, props))
          .then((response, reject) => {
            if (response.status === 200) {
                MySwal.fire({
                  title: "Se actualizaron los registros.",
                  icon: "info",
                  buttonsStyling: true,
                  confirmButtonText: "Ok"
                })
            } 
          })
          .catch((err) => {
                MySwal.fire({
                title: "Error al actualizar los registros.",
                text: err,
                icon: "error",
                buttonsStyling: true,
                confirmButtonText: "Ok"
              })
          })
  }

  return store.selectedItem !== null && store.selectedItem !== undefined ? (
    <Fragment>
    {(!isLogued) && (<Redirect to='/login' />)}
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
                                    onChange={(e) => setFirstName(e.target.value)}
                                    autoComplete={0}
                                    control={control}
                                    value={firstName || ''}
                                    placeholder="Ingresar el nombre"
                                    innerRef={register({ required: true })}
                                    className={classnames({ "is-invalid": errors["firstName"] })}
                                />
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
                                    onChange={(e) => setLastName(e.target.value)}
                                    autoComplete={0}
                                    control={control}
                                    value={lastName || ''}
                                    placeholder="Ingresar el apellido"
                                    innerRef={register({ required: true })}
                                    className={classnames({ "is-invalid": errors["lastName"] })}
                                />
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
                                    
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                    control={control}
                                    value={email || ''}
                                    placeholder="Ingresar el correo electrónico"
                                    innerRef={register({ required: true })}
                                    className={classnames({ "is-invalid": errors["email"] })}
                                />

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
                                      name="password"
                                      id="password"
                                      min='6'
                                      onChange={(e) => setPassword(e.target.value)}
                                      autoComplete="off"
                                      control={control}
                                      value={password || ''}
                                      placeholder="Ingresar el password"
                                      innerRef={register({ required: true })}
                                      className={classnames({ "is-invalid": errors["password"] })}
                                  />
                                </FormGroup>
                            </Col>
                            <Col md='4' sm='4' xs="12">
                                <FormGroup>
                                  <Label for="role">
                                      Rol 
                                  </Label>
                                  <Select
                                    isClearable
                                    name="role"
                                    value={role || ''}
                                    theme={selectThemeColors}
                                    closeMenuOnSelect={true}
                                    components={animatedComponents}
                                    options={roleOptions}
                                    onChange={handleChangeInputRole}
                                    className='react-select'
                                    classNamePrefix='select'
                                    innerRef={register({ required: true })}
                                  />

                                </FormGroup>
                            </Col>
                            <Col md='4' sm='4' xs="12">
                                <FormGroup>
                                  <Label for="isAdmin">
                                      Administrador 
                                  </Label>
                                  <div >
                                    <CustomInput 
                                      inline type='checkbox' 
                                      id='isAdmin' 
                                      label='Es administrador?'
                                      onChange={(e) => setIsAdmin(e.target.checked)} 
                                      checked={isAdmin || false} 
                                      innerRef={register({ required: false })}
                                    />
                                  </div>


                                </FormGroup>
                            </Col>
                        </Row>
                    <Row>
                    <Col>
                        <Button
                        type="submit"
                        className="mr-1"
                        color="primary"
                        disabled={checkDisabled()}
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
    {(!isLogued) && (<Logout />)}
      <Alert color="danger">
        <h4 className="alert-heading">No se encuentra el registro</h4>
        <div className="alert-body">
          El item con el id : {id} no existe, por favor buscalo en :{" "}
          <Link to="/apps/role/list">la lista de items</Link>
        </div>
      </Alert>
      </Fragment>
  )
}
export default ItemEdit
