// ** React Imports
import { useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import { store } from "@store/storeConfig/store"

// ** stores & Actions
import { getItem } from "../store/action"
import ReactToPrint from "react-to-print"
import { updateLogin } from '@store/actions/auth'

// ** Reactstrap
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  CardTitle,
  Button,
  CardHeader,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap"
import BlankLayout from "../../../../@core/layouts/BlankLayout"
import { Printer } from "react-feather"


// ** Styles
import "@styles/react/apps/app-users.scss"
import { capitalizarFirstLetter, getUserData, isObjEmpty, isUserLoggedIn } from "../../../../utility/Utils"

const ItemView = (props) => {
  // ** Vars
  const storeUserData = useSelector(state => state.auth.userData || {})
  const store = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { id } = useParams()
  const componentRef = useRef()

  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(storeUserData)) dispatch(updateLogin(getUserData()))
    return () => {
      setRedirect(null)
    }
}, [dispatch, store.data.length])

  // ** Get suer on mount
  const getDataItem = () => {
    dispatch(getItem(id))
      .then((response) => {
      })
      .catch((error) => {
        //userLogout(false)
      })
  }

  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(storeUserData)) {
      dispatch(updateLogin(getUserData()))
    }
    getDataItem()
  }, [dispatch])

  return store.selectedItem !== null && store.selectedItem !== undefined ? (
    <BlankLayout>
      <div className="app-user-view">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to='#'> Inicio </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to='/apps/user/list'> Usuarios </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <span> Ver Usuario </span>
          </BreadcrumbItem>
        </Breadcrumb>
        <Row>
          <Col className="text-right mb-2">
            <ReactToPrint
              trigger={() => <Button><Printer /></Button>}
              content={() => componentRef.current}
            />
          </Col>
        </Row>
        <div ref={componentRef}>
          <Row>
            <Col xl="12" lg="12" md="12">
              <Card>

                <CardBody>
                  <CardTitle tag='h4'>
                    {(store.selectedItem.firstName && store.selectedItem.lastName) && (
                      <span>
                        <strong>Nombre completo:</strong> {capitalizarFirstLetter(store.selectedItem.firstName)} - {capitalizarFirstLetter(store.selectedItem.lastName)}
                      </span>
                    )}
                  </CardTitle>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle tag="h5">
                    Información complementaria
                  </CardTitle>
                  <Row>
                    {store.selectedItem.email && (
                      <Col className="mb-1" xs="12" lg="3" md="3">
                        <span>
                          <strong>Email: </strong>
                          {store.selectedItem.email}
                        </span>
                      </Col>
                    )}
                    {store.selectedItem.role && (
                      <Col className="mb-1" xs="12" lg="3" md="3">
                        <span>
                          <strong>Rol: </strong>
                          {store.selectedItem.role.name}
                        </span>
                      </Col>
                    )}
                    {store.selectedItem.google && (
                      <Col className="mb-1" xs="12" lg="3" md="3">
                        <span>
                          <strong>Vinculado con Google: </strong>
                          {store.selectedItem.google ? 'Si' : 'No'}
                        </span>
                      </Col>
                    )}
                    {store.selectedItem.isAdmin && (
                      <Col className="mb-1" xs="12" lg="3" md="3">
                        <span>
                          <strong>Es Admin: </strong>
                          {store.selectedItem.isAdmin ? 'Si' : 'No'}
                        </span>
                      </Col>
                    )}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </BlankLayout>
  ) : (
    <BlankLayout>
      <div className='app-general-list'>
        <Alert color="danger">
          <h4 className="alert-heading">Item not found</h4>
          <div className="alert-body">
            El item con el id : {id} no existe, por favor buscalo en :{" "}
            <Link to="/apps/agreement/list">la lista de items</Link>
          </div>
        </Alert>
      </div>
    </BlankLayout>
  )
}
export default ItemView
