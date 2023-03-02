// ** React Imports
import { useState, useEffect } from "react"
import { useParams, Link, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Utils
import { isObjEmpty, getUserData, isUserLoggedIn } from '../../../../utility/Utils' //from '@utils'
import "@styles/react/libs/flatpickr/flatpickr.scss"
// import "@styles/react/apps/app-general.scss"
import '@styles/react/libs/react-select/_react-select.scss'

// Components
import {Card, CardBody, CustomInput, Alert, FormGroup, Button, Form, Row, Col, Label, Breadcrumb, BreadcrumbItem } from "reactstrap"
import CustomFooter from "../../../../layouts/components/Footer"
import BlankLayout from "../../../../@core/layouts/BlankLayout"
import { Home, Unlock } from 'react-feather'


// Actions && Hooks
import { updateLogin } from '@store/actions/auth'
import { addSelectedPermissions, getItem } from "../store/action"
import { getItems as getModules} from '../../roleModules/store/action'
import { addData, deleteData } from '../../rolePermissions/store/action'
import { useIsLogued } from "../../../../utility/hooks/useIsLogued"
import { useForm } from "react-hook-form"


const ItemEdit = (props) => {

// state & Hooks
const state = useSelector((state) => state.role || [])
const stateModules = useSelector((state) => state.roleModules || [])
const stateUserData = useSelector(state => state.auth.userData || [])
const { register, errors, handleSubmit, control } = useForm({})
const [isModulesSelected, setIsModulesSelected] = useState(true)
const [isButtonAllowed, setIsButtonAllowed] = useState(true)
const [isButtonModule, setIsButtonModule] = useState(true)
const [isAllowedSelected, setIsAllowedSelected] = useState(true)
const [isLogued, userLogued, userLogout] = useIsLogued(true)

const { id } = useParams()
const dispatch = useDispatch()

const urlCancel = (state.selectedItem) ? `/apps/role/list` : '' 
  
useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(stateUserData)) {
      dispatch(updateLogin(getUserData()))
      dispatch(getItem(id))
      dispatch(getModules())
      dispatch(addSelectedPermissions(id, 'module'))
    } else {
      dispatch(getItem(id))
      dispatch(getModules())
      dispatch(addSelectedPermissions(id, 'module'))
    }
    
}, [])

const dispatchers = () => {
    dispatch(getItem(id))
    dispatch(getModules())
    dispatch(addSelectedPermissions(id, 'module'))
}

const setters = () => {
  setIsAllowedSelected(true)
  setIsModulesSelected(true)
  setIsButtonModule(true)
  setIsButtonAllowed(true)
}

const onSubmit = (values) => {
  const data = []
    if (values.modules) {
      values.modules.forEach(element => {
        data.push({
          role: id,
          module: element
        })
      })
      dispatch(addData(data))
          .then((response) => {
            dispatchers()
            setters()
          })
    } 

    if (values.allowed) {
      values.allowed.forEach(element => {
      //     dispatch(deletePermission(element))
            data.push({
              id: element
            })
        })
        dispatch(deleteData(data))
            .then((response) => {
              dispatchers()
              setters()
            })
    }
    
}

const handleChange = (e) => {
    if (e.target.name === 'modules') {
      setIsModulesSelected(false)
      setIsButtonModule(false)
    } 
    if (e.target.name === 'allowed') {
      setIsAllowedSelected(false)
      setIsButtonAllowed(false)
    }
}

const OptionsAllowed = () => {
    let optionsAlloweds = []
    if (state.selectedPermissions.length > 0) {
      optionsAlloweds = state.selectedPermissions.map((item) => <option key={item._id} id={item._id} value={item._id}>{item.module.name}</option>
      )
    }
    return (optionsAlloweds)
}

  
return state.selectedItem !== null && state.selectedItem !== undefined ? (
      <BlankLayout>
      {(!isLogued) && (<Logout />)}
      <Breadcrumb>
            <BreadcrumbItem>
              <Link to='#'> Inicio </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to='/apps/role/list'> Rol </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <span> Editar Relaciones con Módulos </span>
            </BreadcrumbItem>
      </Breadcrumb>
          <Card>
            <CardBody >
              <Row>
                <Col md='2' sm='2' xs="2">
                  <h3 className='font-weight-bolder'>Rol:</h3> 
                </Col>
                <Col md='8' sm='8' xs="8">
                  <h3 className='font-weight-normal'>{state.selectedItem.name}</h3>
                </Col>
                <Col md='2' sm='2' xs="2">
                <div className="float-right p-2">
                  <FormGroup>
                    <Button.Ripple outline color='primary'>
                      <Link
                         to={`/apps/role/editPermissions/${id}`}
                         className="user-name text-truncate mb-0"
                      > 
                        <Unlock size={14} />
                        <span className='align-middle ml-25'>Editar Permisos</span>
                      </Link>
                    </Button.Ripple>
                  </FormGroup>
                </div>
                </Col>
              </Row>

              <Row>
                <Col md='5' sm='5' xs="5">
                <Form id="formAllowed" onSubmit={handleSubmit(onSubmit)} >
                  <FormGroup>
                    <Label for='custom-select-size'>Módulos permitidos</Label>
                    <CustomInput
                      type='select' 
                      name='allowed' 
                      id='custom-select-size' 
                      size={15} 
                      multiple
                      innerRef={register({ required: false })}
                      onChange={(e) => handleChange(e)}
                      disabled={!isModulesSelected}
                      >
                        <OptionsAllowed />
                      </CustomInput>
                  </FormGroup>
                </Form>  
                
                </Col>
                <Col md='2' sm='2' xs="2">
                  <div className="float-center p-2">
                      <Button
                        type="submit"
                        form="formModules"
                        className="mr-2"
                        color="primary"
                        disabled={isButtonModule}
                        >
                        {'<<<'}
                      </Button>
                    </div>
                  <div className="float-center p-2">
                    <Button
                      type="submit"
                      form="formAllowed"
                      className="mr-2"
                      color="primary"
                      disabled={isButtonAllowed}
                    >
                      {'>>>'}
                    </Button>
                  </div>
           
                </Col>
                <Col md='5' sm='5' xs="5">
                <Form id="formModules" onSubmit={handleSubmit(onSubmit)} >
                <FormGroup>
                  <Label for='custom-select-size'>Módulos</Label>
                  <CustomInput 
                    type='select' 
                    name='modules' 
                    id='custom-select-size' 
                    size={15} 
                    multiple
                    innerRef={register({ required: false })}
                    onChange={(e) => handleChange(e)}
                    disabled={!isAllowedSelected}
                    >
                    {
                        stateModules.data.map(item => (
                          state.selectedPermissions.find(item2 => item2.module._id === item._id) ? null : <option key={item._id} value={item._id}>{item.name}</option>
                        ))
                    }
                  </CustomInput>
                </FormGroup>
                </Form>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="float-right p-2">
                   
                    <Button color="secondary" type="button" outline>
                          <Link
                            to={urlCancel}
                            className="user-name text-truncate mb-2"
                          >
                            Volver
                          </Link>
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
     
      
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
