// ** React Imports
import { useState, useEffect } from "react"
import { useParams, Link, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"


// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Utils
import { isObjEmpty, typesAbilities, getUserData, typesModules, isUserLoggedIn } from '../../../../utility/Utils' //from '@utils'

//Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import '@styles/react/libs/react-select/_react-select.scss'
import classnames from "classnames"

// ** Components
import { Button, FormGroup, Label, Card, CardBody, Form, Input, Alert, Col, Row, Breadcrumb, BreadcrumbItem } from "reactstrap"
import BreadCrumbs from "../../../../@core/components/breadcrumbs"
import BlankLayout from "../../../../@core/layouts/BlankLayout"


// ** Store & Actions
import {  getInstance, udpateInstance } from "../store/action"
import { updateLogin } from '@store/actions/auth'

//Hooks
import { useForm } from "react-hook-form"
import { useIsLogued } from "../../../../utility/hooks/useIsLogued"


const defaultValues = {
  name: ''
}

const ItemEdit = (props) => {

  const [isLogued, userLogued, userLogout] = useIsLogued(true)
  const { register, errors, handleSubmit, control } = useForm({defaultValues})

  const state = useSelector((state) => state.role || {})
  const stateUserData = useSelector(state => state.auth.userData || {})
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  const { id } = useParams()

  const urlCancel = (state.selectedItem) ? `/apps/role/list` : ``
  
  const getDataItems = () => {
    dispatch(getInstance(id))
      .then((response) => {
        
      })
      .catch((error) => {
        console.log(error)
        //userLogout(false)
      })

  }
  
  useEffect(() => {
    if (!isObjEmpty(state.selectedItem)) {
       setName(state.selectedItem.name)
     } else {
      setName('')
    }
  
  }, [state.selectedItem])

  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(stateUserData)) {
      dispatch(updateLogin(getUserData()))
    }
    getDataItems()
    
  }, [dispatch])

  const checkDisabled = () => {
    let disabled = false
    if (name === '') {
      disabled = true
    }
    return disabled
  }

    // ** Function to handle form submit
  const onSubmit = (values) => {

    values["id"] = id
    values["dataUser"] = {
      userId: stateUserData.id,
      ability: typesAbilities.updated,
      subject: typesModules.role 
    }
      dispatch(udpateInstance(values, props))
       .then((response) => {
          if (response.status === 200) {
            MySwal.fire({
                    title: "Se actualizaron los registros.",
                    icon: "info",
                    buttonsStyling: true,
                    confirmButtonText: "Ok"
                  })
          } else { 
            MySwal.fire({
              title: "Error al actualizar los registros.",
              icon: "error",
              buttonsStyling: true,
              confirmButtonText: "Ok"
            })

          }
       })
      
  }
 
  return state.selectedItem !== null && state.selectedItem !== undefined ? (
      <BlankLayout>
      {(!isLogued) && (<Redirect to='/login' />)}
      <BreadCrumbs breadCrumbTitle='Roles' breadCrumbParent='Gestión de Usuarios' breadCrumbActive='Editar Rol'  />
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
                              autoComplete={0}
                              control={control}
                              onChange={(e) => setName(e.target.value)}
                              value={name || ''}
                              placeholder="Ingresar nombre"
                              innerRef={register({ required: true })}
                              className={classnames({
                                "is-invalid": errors["name"]
                              })}
                            />
                          </FormGroup>
                        </Col>
                   
                        </Row>
                      <Row>
                        <Col>
                          <Button
                            type="submit"
                            className="mr-2"
                            color="primary"
                            disabled={checkDisabled()}
                          >
                            Guardar
                          </Button>
                          <Button color="secondary" type="button" outline>
                                <Link
                                  to={urlCancel}
                                  className="user-name text-truncate mb-2"
                                >
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
    {(!isLogued) && (<Logout />)}
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
