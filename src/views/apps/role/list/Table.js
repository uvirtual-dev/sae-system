
import { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

//SWAL
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

//Components
import { Table, Button, Breadcrumb, BreadcrumbItem, Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { Trash, Edit, Unlock, PlusSquare } from 'react-feather'
import { ModalNewItem } from '../components/ModalNewItem'
// import Logout from "../../authentication/Logout"

//Utils
// import '@styles/react/modules/app-general.scss'
import { typesModules, getUserData, isObjEmpty, isUserLoggedIn, typesAbilities } from '../../../../utility/Utils'
import { useModal } from '../../../../utility/hooks/useModal'

//Actions
import { getItems, deleteItem, delSelectedPermissions, delSelectedItem } from "../store/action"
import { updateLogin } from '@store/actions/auth'
import { Can } from '../../../../utility/context/Can'


const TableList = (props) => {

  const {isLogued, userLogout} = props
  //States & Hooks
  const state = useSelector(state => state.role || {})
  const stateUserData = useSelector(state => state.auth.userData || {})
  const [isOpenModal, openModal, closeModal] = useModal(false)
  const dispatch = useDispatch()

  const getDataItems = () => {
    dispatch(getItems())
        .then((response) => {
        })
        .catch((error) => {
          console.log(error)
          //userLogout(false)
         })
  }
  
  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(stateUserData)) {
      dispatch(updateLogin(getUserData()))
    }
    getDataItems()
    dispatch(delSelectedPermissions())
    dispatch(delSelectedItem())
  }, [dispatch, state.data.length])


const handleClicDelete = (e, id) => {
      e.preventDefault()
      dispatch(deleteItem({
        id,  
        dataUser: {
        userId: stateUserData.id,
        ability: typesAbilities.deleted,
        subject: typesModules.role
        }
    }))
  }

  return (
    <Fragment>
      {(!isLogued) && (<Redirecto to = '/login'/>)}
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
            <ModalNewItem isOpen={isOpenModal} closeModal={closeModal} props={props}/>
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
              (state) &&
              state.allData.map((row, index) => {
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
                            <PlusSquare size={25}/>
                        </Link>
                      </div>
                     
                    </td>
                    <td >
                      <div className='mx-auto p-1'>
                            <Link
                              to={`/apps/role/editPermissions/${row._id}`}
                              className="user-name text-truncate mb-0"
                            >  
                            <Unlock size={25}/>
                        </Link>
                      </div>
                     
                    </td>
                    <td>
                      <div className="d-flex justify-content-left align-items-center">
                          <Link
                            to={`/apps/role/edit/${row._id}`}
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
