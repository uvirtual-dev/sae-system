import { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"

//Components
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Form, Input, Col, Row } from 'reactstrap'

//Import SWAL
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

import { yupResolver } from '@hookform/resolvers/yup'
// ** Store & Actions
import { addRole } from "../store/action"
import { SignupSchema } from '../schemaForm'
import handleError from '../../../../utility/handle.error'

const defaultValues = {
  name: ''
}

export const ModalNewItem = ({ isOpen, closeModal }) => {

  const dispatch = useDispatch()
  const { register, formState: { errors }, reset, watch, clearErrors, handleSubmit, control, setValue } = useForm({ mode: 'onChange', resolver: yupResolver(SignupSchema), defaultValues })

  const [unMountOnSubmit, setUnmountOnSubmit] = useState(true)

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

    dispatch(addRole(values))
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
            Nuevo Rol
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Row>
                <Col md='12' sm='6'>
                  <FormGroup>
                    <Label for="name">
                      Nombre <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="name"
                      id="name"
                      onChange={(e) => setValue("name", e.target.value)}
                      value={watch('name') || ''}
                      autoComplete="off"
                      placeholder="Nombre"
                      control={control}
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

