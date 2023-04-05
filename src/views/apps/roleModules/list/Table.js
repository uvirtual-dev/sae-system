import { Fragment, useState, useEffect } from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Trash, Edit, ExternalLink, MoreVertical, Archive, Trash2 } from 'react-feather'
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardHeader, CardTitle, Row, Col, CardBody, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

//Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

//Actions
import { getRoleModules, deleteRoleModule } from "../store/action"
import { updateLogin } from '@store/actions/auth'

//Utils
import { typesModules, getUserData, isObjEmpty, isUserLoggedIn, typesAbilities } from '../../../../utility/Utils'
// import '@styles/react/apps/app-general.scss'

//Components
// import Logout from "../../authentication/Logout"
import { useModal } from '../../../../utility/hooks/useModal'
import { ModalNewItem } from './ModalNewItem'


const TableList = (props) => {
  // ** States and Hooks
  const { isLogued, userLogout } = props
  const store = useSelector(state => state.roleModules || {})
  const storeUserData = useSelector(state => state.auth.userData || {})
  const [isOpenModal, openModal, closeModal] = useModal(false)
  const dispatch = useDispatch()


  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(storeUserData)) dispatch(updateLogin(getUserData()))

    dispatch(getRoleModules())

  }, [dispatch])


  const handleClicDelete = (e, id) => {
    e.preventDefault()
    dispatch(deleteRoleModule(id))
  }

  return (
    <Fragment>
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
              <ModalNewItem isOpen={isOpenModal} closeModal={closeModal} props={props} />
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
                  (store) &&
                  store.data.map((row, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='align-middle font-weight-bold'>{row.name}</span>
                        </td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle tag='div' className='btn btn-sm'>
                              <MoreVertical size={14} className='cursor-pointer' />
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem
                                tag={Link}
                                to={`/apps/roleModules/edit/${row._id}`}
                                className='w-100'
                              >
                                <Archive size={14} className='mr-50' />
                                <span className='align-middle'>Editar</span>
                              </DropdownItem>
                              <DropdownItem className='w-100'
                                onClick={() => {
                                  MySwal.fire({
                                    title: "¿Quieres borrar este item?",
                                    icon: "info",
                                    customClass: {
                                      confirmButton: "btn btn-danger mr-2",
                                      cancelButton: "btn btn-primary"
                                    },
                                    showCancelButton: true,
                                    buttonsStyling: true,
                                    confirmButtonText: "Si, Borrarlo",
                                    cancelButtonText: "Cancelar"
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      dispatch(deleteRoleModule(row._id))
                                    } else if (result.isDenied) {
                                      MySwal.fire("Changes are not saved", "", "info")
                                    }
                                  })
                                }}
                              >
                                <Trash2 size={14} className='mr-50' />
                                <span className='align-middle'>Eliminar</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>

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
