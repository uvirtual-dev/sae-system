    import { Fragment, useState, useEffect } from 'react'
    import { useDispatch, useSelector } from "react-redux"
    import { useForm } from "react-hook-form"

    import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup,
    Label,
    Form,
    Input,
    Col,
    Row,
    InputGroupAddon,
    InputGroupText,
    CustomInput} from 'reactstrap'
    import InputPasswordToggle from '@components/input-password-toggle'
    import Select from 'react-select'

    import classnames from "classnames"
    import makeAnimated from 'react-select/animated'
    import { selectThemeColors } from '@utils'

    //Import SWAL
    import Swal from "sweetalert2"
    import withReactContent from "sweetalert2-react-content"
    const MySwal = withReactContent(Swal)

    // ** Store & Actions
    import {
        addItem,
        addNewData,
        delNewData
      } from "../store/action"
import { typesModules, isObjEmpty, typesAbilities } from '../../../../utility/Utils'

  const defaultValues = {
     firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      isAdmin: false
  }
 
export const ModalNewItem = ({isOpen, closeModal}) => {
   
  const dispatch = useDispatch()

  const { register, errors, handleSubmit, control } = useForm({defaultValues})
  
  const stateNewData = useSelector((state) => state.user.newData)
  const stateUserData = useSelector(state => state.auth.userData || {})
  const storeRole = useSelector(state => state.role || [])

  let dataNew = {}
  const animatedComponents = makeAnimated()

  //Fields Programs
  const [firstName, setFirstName] = useState(stateNewData.firstName || '')
  const [lastName, setLastName] = useState(stateNewData.lastName || '')
  const [email, setEmail] = useState(stateNewData.email || '')
  const [password, setPassword] = useState(stateNewData.password || '')
  const [role, setRole] = useState(stateNewData.role || '')
  const [isAdmin, setIsAdmin] = useState(false)

  const [unMountOnSubmit, setUnmountOnSubmit] = useState(true)
  const [roleOptions, setRoleOptions] = useState([])

  //Disabled input submit
  const checkDisabled = () => {
    let disabled = false
   if (isObjEmpty(stateNewData) || firstName === '' || lastName === '' || email === '' || password === '') {
      disabled = true
    }
    return disabled
  }

  const clearInputsData = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setRole('')
    setIsAdmin(false)
  }
  //Clear fields modal
  const clearDataModal = () => {
    dispatch(delNewData())
    dataNew = {}
    closeModal()
    clearInputsData()
   }
   
  //button cancel
  const handleInputCancel = () => { 
    clearDataModal()
    clearInputsData()
   }

   useEffect(() => {
    const options = []
    if (storeRole.allData.length > 0) {
      storeRole.allData.map((item, index) => {
        options.push({ value: item._id, label: item.name })
      })
    }
    setRoleOptions(options)
  
  }, [dispatch, storeRole.allData.length])

  useEffect(() => {
    if (isOpen) {
      dataNew = {
         firstName,
         lastName,
         email,
         password,
         role,
         isAdmin
        }
      dispatch(addNewData(dataNew))
    }
   
  }, [firstName, lastName, password, role, email, isAdmin])


    // ** Function to handle form submit
    const onSubmit = (values) => {
      if (!isAdmin) {
        values["role"] = role
      }
      values["isAdmin"] = isAdmin
      values["dataUser"] = {
        userId: stateUserData.id,
        ability: typesAbilities.created,
        subject: typesModules.user
      }
        dispatch(addItem(values))
              .then((response, reject) => {
                if (response.status === 200) {
                
                  setUnmountOnSubmit(false)
                    clearDataModal()
                    MySwal.fire({
                      title: "Se agregó el nuevo registro exitosamente.",
                      icon: "info",
                      buttonsStyling: true,
                      confirmButtonText: "Ok"
                    })

                } 
              })
              .catch((err) => {
                    MySwal.fire({
                    title: "Hubo un error al agregar el registro.",
                    text: err,
                    icon: "error",
                    buttonsStyling: true,
                    confirmButtonText: "Ok"
                  })
              })
      
      }

  return (
            <Fragment key={4}>
                <div>
                    <Modal
                      isOpen={isOpen}
                      toggle={closeModal}
                      className={`modal-dialog-centered modal-lg`}
                      key={4}
                      unmountOnClose={unMountOnSubmit}
                    >
                    <ModalHeader toggle={closeModal}>
                        Nuevo Usuario
                    </ModalHeader>
                    <ModalBody>
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
                                name="email"
                                id="email"
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
                                isClearable={false}
                                theme={selectThemeColors}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={roleOptions}
                                onChange={(e) => setRole(e.value)}
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
                    color="secondary"
                    outline
                    onClick={handleInputCancel}
                    >
                    Cancelar
                    </Button>
                </Col>
                </Row>
             </Form>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                    </Modal>
            
            </div>
            </Fragment>
  )
}

