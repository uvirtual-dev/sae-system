import { useState, useEffect } from "react"
import { useParams, Link, Redirect } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Utils
import "@styles/react/libs/flatpickr/flatpickr.scss"
import '@styles/react/libs/react-select/_react-select.scss'
// import "@styles/react/apps/app-general.scss"
import { useIsLogued } from "../../../../utility/hooks/useIsLogued"
import { isObjEmpty, getUserData, isUserLoggedIn } from '../../../../utility/Utils' //from '@utils'

// Components
import {Card, CardBody, CustomInput, Alert,  Button, Row, Col,  Breadcrumb, BreadcrumbItem } from "reactstrap"
import CustomFooter from "../../../../layouts/components/Footer"
import BlankLayout from "../../../../@core/layouts/BlankLayout"

// react-data-table components
import { CompactTable } from '@table-library/react-table-library/compact'
import { useTheme } from '@table-library/react-table-library/theme'
import { getTheme } from '@table-library/react-table-library/baseline'

// Actions
import {addSelectedPermissions, getItem, delSelectedPermissions, delSelectedItem  } from "../store/action"
import {udpateItem as updatePermission} from '../../rolePermissions/store/action'
import { updateLogin } from '@store/actions/auth'

const ItemEdit = (props) => {
  //Store && Hooks
  const state = useSelector((state) => state.role || {})
  const stateUserData = useSelector(state => state.auth.userData || {})
  const [data, setData] = useState([])
  const theme = useTheme(getTheme())
  const [isLogued, userLogued, userLogout] = useIsLogued(true)
  const { id } = useParams()
  const dispatch = useDispatch()

  const urlCancel = (state.selectedItem) ? `/apps/role/list` : ''
  
  useEffect(() => {
    dispatch(delSelectedPermissions())
    dispatch(delSelectedItem())
  }, [])
  

  useEffect(() => {
      const nodes = state.selectedPermissions
        setData({nodes})    
  }, [state.selectedPermissions.length])
  
  
  const handleUpdate = (value, id, property) => {
    setData((state) => ({
      ...state,
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          return { ...node, [property]: value }
        } else {
          return node
        }
      })
    }))
    
  }
    
  const getDataItems = () => {
    dispatch(getItem(id))
    .then((response) => {
    })
    .catch((error) => {
      userLogout(false)
     })
     dispatch(addSelectedPermissions(id, 'node'))
  }

  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(stateUserData)) {
      dispatch(updateLogin(getUserData()))
      getDataItems()
     
    } else {
      getDataItems()
    }
  }, [])

  //Data Columns
  const columns = [
    {
      label: 'Module',
      renderCell: (item) => (item.module)
    },
    {
      label: 'Read',
      renderCell: (item) => (
        <CustomInput
          id={`read-${item.id}`}
          type="checkbox"
          checked={item.isRead}
          onChange={(event) => handleUpdate(event.target.checked, item.id, 'isRead')}
        />
      )
    },
    {
      label: 'Create',
      renderCell: (item) => (
        <CustomInput
        id={`create-${item.id}`}
        type="checkbox"
        checked={item.isCreate}
        onChange={(event) => handleUpdate(event.target.checked, item.id, 'isCreate')}
      />
      )
    },
    {
      label: 'Update',
      renderCell: (item) => (
        <CustomInput
        id={`update-${item.id}`}
        
          type="checkbox"
          checked={item.isUpdate}
          onChange={(event) => handleUpdate(event.target.checked, item.id, 'isUpdate')}
        />
     
      )
    },
    {
      label: 'Delete',
      renderCell: (item) => (
        <CustomInput
        id={`delete-${item.id}`}
        type="checkbox"
        checked={item.isDelete}
        onChange={(event) => handleUpdate(event.target.checked, item.id, 'isDelete')}
      />
      )
    }
  ]

  const handleSubmit = (e, data) => {
    e.preventDefault()
    const arrayData = []
    data.nodes.forEach(element => {
    
      arrayData.push({
        id: element.id,
        read: element.isRead,
        created: element.isCreate,
        updated: element.isUpdate,
        deleted: element.isDelete
      })
    })
    
    dispatch(updatePermission(arrayData, id, props))
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
  return state.selectedPermissions !== null && state.selectedPermissions !== undefined && state.selectedPermissions.length > 0 ? (
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
              <span> Editar Permisos </span>
            </BreadcrumbItem>
      </Breadcrumb>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <Row className="p-2">
                <Col sm="2">
                  <h3 className='font-weight-bolder'>Rol:</h3> 
                </Col>
                <Col sm="10">
                  <h3 className='font-weight-normal'>{state.selectedItem.name}</h3>
                </Col>
              </Row>
              <Row>
                <Col md='12' sm='12'>
                <CompactTable columns={columns} data={data} theme={theme} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="float-right p-2">
                    <Button
                      type="submit"
                      className="mr-2"
                      color="primary"
                      onClick={(e) => handleSubmit(e, data)}
                    >
                      Guardar
                    </Button>
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
