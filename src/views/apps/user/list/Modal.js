import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup,
    Label,
    Form,
    Input,
    Col,
    Row,
    Alert} from 'reactstrap'
    
const Modale = ({isOpen, closeModal}) => {
    const { register, handleSubmit, errors, setValue } = useForm()
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [unMountOnSubmit, setUnmountOnSubmit] = useState(true)

    useEffect(() => {
      setValue('nombre', nombre)
    }, [nombre, setValue])
  
    useEffect(() => {
      setValue('apellido', apellido)
    }, [apellido, setValue])
  
    const onSubmit = data => console.log(data)
  
    const handleNombreChange = (event) => {
      setNombre(event.target.value)
    }
  
    const handleApellidoChange = (event) => {
      setApellido(event.target.value)
    }
  return (
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Nombre:</label>
      <input type="text" name="nombre" defaultValue={nombre} onChange={handleNombreChange} ref={el => {
        register(el, { required: true })
      }} />
      {errors.nombre && <span>Este campo es requerido</span>}
      
      <label>Apellido:</label>
      <input type="text" name="apellido" defaultValue={apellido} onChange={handleApellidoChange} ref={el => {
        register(el, { required: true })
      }} />
      {errors.apellido && <span>Este campo es requerido</span>}
      
      <button type="submit">Enviar</button>
    </form>
    </ModalBody>
                <ModalFooter>
                </ModalFooter>
                </Modal>
  )
}


export default Modale
