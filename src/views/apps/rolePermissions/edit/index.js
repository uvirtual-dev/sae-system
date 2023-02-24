// ** React Imports
import { useState, useEffect } from "react"
import { useParams, Link, Redirect } from "react-router-dom"

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Utils
import "@styles/react/libs/flatpickr/flatpickr.scss"

// ** Third Party Components
import classnames from "classnames"
import {
  Button,
  FormGroup,
  Label,
  Card,
  CardBody,
  Form,
  Input,
  Alert,
  Col,
  Row,
  Breadcrumb,
  BreadcrumbItem,
  CardHeader,
  CardTitle
} from "reactstrap"
import { useForm } from "react-hook-form"
import '@styles/react/libs/react-select/_react-select.scss'

import { isObjEmpty, typesAbilities, typesModules } from '../../../../utility/Utils' //from '@utils'

// ** Store & Actions
import {
  getItem,
  udpateItem
} from "../store/action"

// ** Styles
// import "@styles/react/apps/app-general.scss"
import { types } from "../store/types"
import CustomFooter from "../../../../layouts/components/Footer"
import BreadCrumbs from "../../../../@core/components/breadcrumbs"
import BlankLayout from "../../../../@core/layouts/BlankLayout"
import { useIsLogued } from "../../../../utility/hooks/useIsLogued"
// import Logout from "../../authentication/Logout"
// import { typesSubjects } from "../../../../utility/Utils"


const defaultValues = {
  name: ''
}

const ItemEdit = (props) => {
  const [isLogued, userLogued, userLogout] = useIsLogued(true)
  //Data form
  const { register, errors, handleSubmit, control } = useForm({defaultValues})

  const state = useSelector((state) => state.roleModules || {})
  const stateUserData = useSelector(state => state.auth.userData || {})

  const { id } = useParams()
  const dispatch = useDispatch()

  //Fields Programs
  const [name, setName] = useState('')
  

  let urlCancel = ''
  
  if (state.selectedItem) {
    urlCancel = `/apps/roleModules/list`
  }

  useEffect(() => {
    dispatch(getItem(id))
    .then((response) => {
    })
    .catch((error) => {
      userLogout(false)
     })
    
  }, [])
  
  useEffect(() => {
    if (!isObjEmpty(state.selectedItem)) {
       setName(state.selectedItem.name)
     } else {
      setName('')
    }
  
  }, [state.selectedItem])


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
      subject: typesModules.roleModules
    }
      dispatch(udpateItem(values, props))
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
      {(!isLogued) && (<Logout />)}
      <BreadCrumbs breadCrumbTitle='Modelos' breadCrumbParent='Gestión de Modelos' breadCrumbActive='Editar Modelo'  />

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
                            className="mr-1"
                            color="primary"
                            disabled={checkDisabled()}
                          >
                            Guardar
                          </Button>
                          <Button color="secondary" type="button" outline>
                                <Link
                                  to={urlCancel}
                                  className="user-name text-truncate mb-0"
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
    {(!isLogued) && (<Redirect to='/login' />)}
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
