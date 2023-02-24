    import { Fragment, useState, useEffect } from 'react'
    import { useDispatch, useSelector } from "react-redux"
    import { useForm } from "react-hook-form"

    import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup,
    Label,
    Form,
    Input,
    Col,
    Row} from 'reactstrap'
  
    import classnames from "classnames"

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
     name: ''
  }
 
export const ModalNewItem = ({isOpen, closeModal}) => {
   
  const dispatch = useDispatch()

  const { register, errors, handleSubmit, control } = useForm({defaultValues})
  
  const stateNewData = useSelector((state) => state.roleModules.newData)
  const stateUserData = useSelector(state => state.auth.userData || {})

  let dataNew = {}

  //Fields Programs
  const [name, setName] = useState(stateNewData.name || '')
  const [unMountOnSubmit, setUnmountOnSubmit] = useState(true)

  //Disabled input submit
  const checkDisabled = () => {
    let disabled = false
   if (isObjEmpty(stateNewData) || name === '') {
      disabled = true
    }
    return disabled
  }

  //Clear fields modal
  const clearDataModal = () => {
    dispatch(delNewData())
    dataNew = {}
   closeModal()
    if (name) {
      setName('')
    }
   }
   
  //button cancel
  const handleInputCancel = () => { 
    clearDataModal()
    setName('')
   }

  useEffect(() => {
    if (isOpen) {
      dataNew = {
         name
       }
      dispatch(addNewData(dataNew))
    }
   
  }, [name])


    // ** Function to handle form submit
    const onSubmit = (values) => {
      values["dataUser"] = {
        userId: stateUserData.id,
        ability: typesAbilities.created,
        subject: typesModules.roleModules
      }
      console.log(values)
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
                        Nuevo Módulo
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
                            onChange={(e) => setName(e.target.value)}
                            autoComplete={0}
                            control={control}
                            value={name || ''}
                            placeholder="Ingresar el nombre"
                            innerRef={register({ required: true })}
                            className={classnames({ "is-invalid": errors["name"] })}
                        />
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

