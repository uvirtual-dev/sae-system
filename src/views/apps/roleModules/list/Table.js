import { Fragment, useState, useEffect } from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Trash, Edit, ExternalLink } from 'react-feather'
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardHeader, CardTitle, Row, Col, CardBody } from 'reactstrap'

//Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

//Actions
import { getItems, deleteItem } from "../store/action"
import { updateLogin } from '@store/actions/auth'

//Utils
import { typesModules, getUserData, isObjEmpty, isUserLoggedIn, typesAbilities } from '../../../../utility/Utils'
// import '@styles/react/apps/app-general.scss'

//Components
// import Logout from "../../authentication/Logout"
import { useModal } from '../../../../utility/hooks/useModal'
import BreadCrumbs from '../../../../@core/components/breadcrumbs'
import { ModalNewItem } from '../components/ModalNewItem'


const TableList = (props) => {
  // ** States and Hooks
  const {isLogued, userLogout} = props
  const state = useSelector(state => state.roleModules || {})
  const stateUserData = useSelector(state => state.auth.userData || {})
  const [isOpenModal, openModal, closeModal] = useModal(false)
  const dispatch = useDispatch()

  const getDataItems = () => {
    dispatch(getItems())
        .then((response) => {
        })
        .catch((error) => {
          //userLogout(false)
         })
  }
  
  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(stateUserData)) {
      dispatch(updateLogin(getUserData()))
    }
    getDataItems()
  }, [])


const handleClicDelete = (e, id) => {
      e.preventDefault()
      dispatch(deleteItem(id))
  }

  return (
    <Fragment>
      {(!isLogued) && (<Redirect to='/login' />)}
      <Breadcrumb>
            <BreadcrumbItem>
              <Link to='#'> Inicio </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <Link to='/apps/roleModules/list'>Gestión de Módulos</Link>
            </BreadcrumbItem>
      </Breadcrumb>
      <Card>
          <CardHeader className='border-bottom'>
            <CardTitle tag='h4'> Formulario de Módulos </CardTitle>
          </CardHeader>
       </Card>
    <div >
    <Card>
      <CardBody>
            <div className="float-right p-2">
            <Button.Ripple color='primary' onClick={openModal} key={4} outline>
              Agregar nuevo
            </Button.Ripple>
            <ModalNewItem isOpen={isOpenModal} closeModal={closeModal} props={props}/>
            </div>
        <Table responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {
              (state) &&
              state.data.map((row, index) => {
                return (
                    <tr key={index}>
                    <td>
                      <span className='align-middle font-weight-bold'>{row.name}</span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-left align-items-center">
                          <Link
                            to={`/apps/roleModules/edit/${row._id}`}
                            className="user-name text-truncate mb-0"
                           >
                            <Button.Ripple className='btn-icon rounded-circle' color='flat-primary'>
                              <Edit size={20} />
                            </Button.Ripple>
                          </Link>
                          <Button.Ripple 
                                className='btn-icon rounded-circle' color='danger'
                                outline
                                onClick={(e) => {
                                  MySwal.fire({
                                    title: "¿Quieres borrar este item?",
                                    icon: "info",
                                    showCancelButton: true,
                                    customClass: {
                                      confirmButton: "btn btn-danger mr-2",
                                      cancelButton: "btn btn-primary mr-2"
                                    },
                                  
                                    buttonsStyling: true,
                                    confirmButtonText: "Si, Borrarlo",
                                    cancelButtonText: "Cancelar"
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      handleClicDelete(e, row._id) 
                                    } else if (result.isDenied) {
                                      MySwal.fire("Changes are not saved", "", "info")
                                    }
                                  })
                                }}
                          >
                            <Trash size={15} />
                            </Button.Ripple>
                        </div>
                    </td>
                  </tr>
                )
                              
              })
            }
           
          </tbody>
        </Table> 
      </CardBody>
    </Card>

    </div> 
    </Fragment>
  )
}

export default TableList
