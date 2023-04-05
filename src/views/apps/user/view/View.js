// ** React Imports
import { useEffect, useRef, useMemo} from "react"
import { useParams, Link, useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

// ** stores & Actions
import { getUser } from "../store/action"
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
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap"
import BlankLayout from "../../../../@core/layouts/BlankLayout"
import { Printer } from "react-feather"

// Swal
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Styles
import "@styles/react/apps/app-users.scss"

import { capitalizarFirstLetter, getUserData, isObjEmpty, isTokenActive, isUserLoggedIn } from "../../../../utility/Utils"
import { useIsLogued } from "../../../../utility/hooks/useIsLogued"

const ItemView = (props) => {
  // ** Vars
  const storeUserData = useSelector(state => state.auth.userData || {})
  const store = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const history = useHistory()
  const { id } = useParams()
  const componentRef = useRef()
  const [isLogued, userLogued, userLogout] = useIsLogued(true)
  const isTokenValid = useMemo(() => isTokenActive())

  const validateSession = () => {
    if (!isTokenValid || !isLogued) {
      MySwal.fire({
        title: "Error!",
        html: `Usuario no autorizado, o su sesión caducó, por favor inicie sesión nuevamente.`,
        icon: "error",
        buttonsStyling: true,
        showConfirmButton: false
        }).then(() => {
          history.push("/logout")
        })
    }
  }
  useEffect(() => {
    validateSession()
  }, [])

  useEffect(() => {
    if (isUserLoggedIn() && isObjEmpty(storeUserData)) dispatch(updateLogin(getUserData()))
   
}, [dispatch, store.data.length])

  // ** Get suer on mount
  const getDataItem = () => {
    dispatch(getUser(id))
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
            <Link to="/apps/user/list">la lista de items</Link>
          </div>
        </Alert>
      </div>
    </BlankLayout>
  )
}
export default ItemView
