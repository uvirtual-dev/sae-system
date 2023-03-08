// ** React Imports
import { useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { formatDate } from "@utils"
import Avatar from "@components/avatar"
// import Moment from "react-moment"
// import "moment-timezone"
// import "moment/locale/es"
import { store } from "@store/storeConfig/store"

// ** stores & Actions
import { getItem } from "../store/action"
import { useSelector, useDispatch } from "react-redux"
import ReactToPrint from "react-to-print"

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

// ** Styles
import "@styles/react/apps/app-users.scss"
import { Printer } from "react-feather"
import CustomFooter from "../../../../layouts/components/Footer"

const ItemView = (props) => {
  // ** Vars
  const state = useSelector((state) => state.versions),
    dispatch = useDispatch(),
    { id } = useParams()
  const componentRef = useRef()

  // ** Get suer on mount
  useEffect(() => {
    dispatch(getItem(id))
  }, [dispatch])

  return state.selectedItem !== null && state.selectedItem !== undefined ? (
    <div className="app-user-view">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to='#'> Inicio </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to='/apps/program/list'> Programa </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={`/apps/version/list/${state.currentProgram}`}> Version </Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <span> Ver Version </span>
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
              <CardHeader>
                  {!!state.selectedItem.period && (
                    <span>
                            <strong>Periodo: </strong>
                            {state.selectedItem.period} / {state.selectedItem.year}
                          </span>
                  )}
              </CardHeader>
              <CardBody>
                <CardTitle tag='h4'>
                    {!!state.selectedItem.universityNomenclature && (
                      <span>
                              <strong>Nomenclatura de la universidad:</strong> {state.selectedItem.universityNomenclature}
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
                   {!!state.selectedItem.directorAcad && (
                    <Col className="mb-1" xs="12" lg="6" md="6">
                      <span>
                        <strong>Director Académico: </strong>
                        {state.selectedItem.directorAcad.name} {state.selectedItem.directorAcad.lastName}
                      </span>
                    </Col>
                  )}
                  {!!state.selectedItem.coordinatorAcad && (
                   <Col className="mb-1" xs="12" lg="6" md="6">
                     <span>
                       <strong>Coordinador Académico: </strong>
                       {state.selectedItem.coordinatorAcad.name}  {state.selectedItem.coordinatorAcad.lastName}
                     </span>
                   </Col>
                  )}

                </Row>
                <Row>
                  {!!state.selectedItem.numberAuthorizedParallels && (
                    <Col className="mb-1" xs="12" lg="4" md="4">
                      <span>
                        <strong>No. de paralelos autorizados: </strong>
                        {state.selectedItem.numberAuthorizedParallels}
                      </span>
                    </Col>
                  )}
                  {!!state.selectedItem.startDate && (
                    <Col className="mb-1" xs="12" lg="4" md="4">
                      <span>
                        <strong>Fecha inicio: </strong>
                        {formatDate(state.selectedItem.startDate)}
                      </span>
                    </Col>
                  )}

                  {!!state.selectedItem.endDate && (
                    <Col className="mb-1" xs="12" lg="4" md="4">
                      <span>
                        <strong>Fecha fin: </strong>
                        {formatDate(state.selectedItem.endDate)}
                      </span>
                    </Col>
                  )}

               
                </Row>

                <Row>
                  {!!state.selectedItem.priceDirector && (
                    <Col className="mb-1" xs="12" lg="6" md="6">
                      <span>
                        <strong>Honorarios Director: </strong>
                        {state.selectedItem.priceDirector}
                      </span>
                    </Col>
                  )}
                  {!!state.selectedItem.priceCoordinator && (
                    <Col className="mb-1" xs="12" lg="6" md="6">
                      <span>
                        <strong>Honorarios Coordinador: </strong>
                        {state.selectedItem.priceCoordinator}
                      </span>
                    </Col>
                  )}
                </Row>

                <Row>
                {!!state.selectedItem.priceTeacher && (
                      <Col className="mb-1" xs="12" lg="6" md="6">
                        <span >
                          <strong>Honorarios Profesor: </strong>{" "}
                          {state.selectedItem.priceTeacher}
                        </span>
                      </Col>
                  )}
                  {!!state.selectedItem.priceTutorTfm && (
                      <Col className="mb-1" xs="12" lg="6" md="6">
                      <span>
                        <strong>Honorarios Profesor TFM: </strong>
                        {state.selectedItem.priceTutorTfm}
                      </span>
                    </Col>
                  )}
                </Row>
                <Row>
                    {!!state.selectedItem.observations && (
                    <Col xs="12" lg="12" md="12">
                      <span className="mr-2">
                        <strong>Observaciones: </strong>{" "}
                        {state.selectedItem.observations}
                      </span>
                    </Col>
                    )}
                </Row>
                <Row>
                    {!!state.selectedItem.extraordinaryAgreements && (
                    <Col xs="12" lg="12" md="12">
                      <span className="mr-2">
                        <strong>Acuerdos extraordinarios: </strong>{" "}
                        {state.selectedItem.extraordinaryAgreements}
                      </span>
                    </Col>
                    )}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    <CustomFooter />
    </div>
  ) : (
    <div className='app-general-list'>
      <Alert color="danger">
        <h4 className="alert-heading">Item not found</h4>
        <div className="alert-body">
          El item con el id : {id} no existe, por favor buscalo en :{" "}
          <Link to="/apps/user/list">la lista de items</Link>
        </div>
      </Alert>
      <CustomFooter />
    </div>
  )
}
export default ItemView
