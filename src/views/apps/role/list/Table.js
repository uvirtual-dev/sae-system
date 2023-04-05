
import { Fragment, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

//SWAL
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

//Components
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardHeader, CardTitle, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Trash, Edit, Unlock, PlusSquare, MoreVertical, Archive, Trash2 } from 'react-feather'
import { ModalNewItem } from './ModalNewItem'
// import Logout from "../../authentication/Logout"

//Utils
// import '@styles/react/modules/app-general.scss'
import { typesModules, getUserData, isObjEmpty, isUserLoggedIn, typesAbilities, isTokenActive } from '../../../../utility/Utils'
import { useModal } from '../../../../utility/hooks/useModal'

//Actions
import { getRoles, deleteRole, delSelectedPermissions, delSelectedItem } from "../store/action"
import { updateLogin } from '@store/actions/auth'
import { Can } from '../../../../utility/context/Can'


const TableList = (props) => {

  //States & Hooks
  const store = useSelector(state => state.role || {})
  const storeUserData = useSelector(state => state.auth.userData || {})
  const [isOpenModal, openModal, closeModal] = useModal(false)
  const dispatch = useDispatch()
  const isTokenValid = useMemo(() => isTokenActive())

  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(storeUserData)) dispatch(updateLogin(getUserData()))
    if (!isTokenValid) {
      MySwal.fire({
        title: "Error!",
        html: `Usuario no autorizado, o su sesión caducó, por favor inicie sesión nuevamente.`,
        icon: "error",
        buttonsStyling: true,
        showConfirmButton: false
      }).then(() => {
        history.push("/logout")
      })
    } else {
      dispatch(getRoles())
            .catch((error) => {
              const { message, status } = handleError(error)
              const msgHtml = (status === 401 || status === 403) ? `Sucedió un error con la petición! <br>. <p class="text-danger">${message}<p>` : `Por favor actualice la página! <br>. <p class="text-danger">${message}<p>`
              MySwal.fire({
                title: `Error! ${status}`,
                html: msgHtml,
                icon: "error",
                buttonsStyling: true,
                showConfirmButton: false
              })
            })
      dispatch(delSelectedPermissions())
      dispatch(delSelectedItem())
    }
  
  }, [store.data.length])


  return (
    <Fragment>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to='#'> Inicio </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <Link to='/apps/role/list'>Roles</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <CardHeader className='border-bottom'>
          <CardTitle tag='h4'> Formulario de Roles </CardTitle>
        </CardHeader>
      </Card>
      <div >
        <Card>
          <CardBody>
            <div className="float-right p-2">
              <Can I="create" a="roles">
                <Button.Ripple color='primary' onClick={openModal} key={4} outline>
                  Agregar nuevo
                </Button.Ripple>
              </Can>
              <ModalNewItem isOpen={isOpenModal} closeModal={closeModal} props={props} />
            </div>
            <Table responsive>
              <thead>
                <tr>
                  <th>Roles</th>
                  <th>Asignar</th>
                  <th>Permisos</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {
                  (store) &&
                  store.allData.map((row, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='align-middle font-weight-bold'>{row.name}</span>
                        </td>
                        <td>
                          <div className='mx-auto p-1'>
                            <Link
                              to={`/apps/role/roleModulesRelation/${row._id}`}
                              className="user-name text-truncate mb-0"
                            >
                              <PlusSquare size={25} />
                            </Link>
                          </div>

                        </td>
                        <td >
                          <div className='mx-auto p-1'>
                            <Link
                              to={`/apps/role/editPermissions/${row._id}`}
                              className="user-name text-truncate mb-0"
                            >
                              <Unlock size={25} />
                            </Link>
                          </div>

                        </td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle tag='div' className='btn btn-sm'>
                              <MoreVertical size={14} className='cursor-pointer' />
                            </DropdownToggle>
                            <DropdownMenu right>
                              <DropdownItem
                                tag={Link}
                                to={`/apps/role/edit/${row._id}`}
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
                                      dispatch(deleteRole(row._id))
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
