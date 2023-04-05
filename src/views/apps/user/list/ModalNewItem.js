import { Fragment, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"

import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
  FormGroup,
  Label,
  Form,
  Input,
  Col,
  Row
} from 'reactstrap'
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
  addUser
} from "../store/action"
import { useOptionsSelectModules } from '../../../../utility/hooks/useOptionsSelectModules'
import handleError from '../../../../utility/handle.error'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: ''
}

export const ModalNewItem = ({ isOpen, closeModal }) => {
  const SignupSchema = yup.object().shape({
    email: yup.string().matches(/^[a-zA-Z0-9._%+-]+@uvirtual\.org$/, 'Debe ser correo @uvirtual.org').email("Debe ser un email válido").required("Campo obligatorio"),
    lastName: yup.string().min(3, "Debe tener mas de 3 caracteres").required("Campo obligatorio"),
    firstName: yup.string().min(3, "Debe tener mas de 3 caracteres").required("Campo obligatorio"),
    password: yup.string().min(6, "Debe tener mas de 6 caracteres").required("Campo obligatorio"),
    role: yup.object().shape({
      value: yup.string().test('not-empty', 'Campo obligatorio', value => value !== ''),
      label: yup.string()
    }).required('Debe seleccionar un valor')
  })
  const dispatch = useDispatch()
  const animatedComponents = makeAnimated()

  const { register, formState: { errors }, reset, watch, clearErrors, handleSubmit, control, setValue } = useForm({ mode: 'onChange', resolver: yupResolver(SignupSchema), defaultValues })

  const storeRole = useSelector(state => state.role || [])

  const [unMountOnSubmit, setUnmountOnSubmit] = useState(true)
  const roleOptions = useOptionsSelectModules(storeRole.allData)


  //Clear fields modal
  const clearDataModal = () => {
    closeModal()
    reset()
  }

  //button cancel
  const handleInputCancel = () => {
    clearDataModal()
    clearErrors()
  }

  // ** Function to handle form submit
  const onSubmit = (values) => {
    values["role"] = values["role"].value
    dispatch(addUser(values))
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

  return (
    <Fragment key={4}>
      <div>
        <Modal
          isOpen={isOpen}
          toggle={closeModal}
          className={`modal-dialog-centered modal-lg`}
          key={4}
          unmountOnClose={unMountOnSubmit}
          backdrop="static"
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
                      onChange={(e) => setValue("firstName", e.target.value)}
                      value={watch('firstName') || ''}
                      autoComplete="off"
                      // value={firstName || ''}
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

