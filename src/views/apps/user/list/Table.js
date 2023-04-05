// ** React Imports
import { Fragment, useState, useEffect, useMemo } from 'react'
// ** Invoice List Sidebar
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

// ** Columns
import { columns } from './columns'

// ** Store & Actions
import { getUsersPaginate } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'
import { updateLogin } from '@store/actions/auth'
import { getRoles as getRoles } from '../../role/store/action'
// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { selectThemeColors } from '@utils'
import { useModal } from '../../../../utility/hooks/useModal'

import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button, Breadcrumb, BreadcrumbItem } from 'reactstrap'
import { ModalNewItem } from './ModalNewItem'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { getUserData, isObjEmpty, isTokenActive, isUserLoggedIn } from '../../../../utility/Utils'
import useDebounce from '../../../../utility/hooks/useDebounce'
import { Link, useHistory } from 'react-router-dom'
import { types } from '../store/types'

import { Can } from '../../../../utility/context/Can'
import ErrorBoundary from '../../../../utility/error.boundary'
import { useOptionsSelectModules } from '../../../../utility/hooks/useOptionsSelectModules'
// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm, setSearchTerm }) => {
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <Label for='rows-per-page'>Mostrar</Label>
            <CustomInput
              className='form-control mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{
                width: '5rem',
                padding: '0 0.8rem',
                backgroundPosition: 'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0'
              }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </CustomInput>
            <Label for='rows-per-page'>Filas</Label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
        >
          <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
            <Label className='mb-0' for='search-invoice'>
              Buscar:
            </Label>
            <Input
              id='search-invoice'
              className='ml-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

const UsersList = (props) => {
  const history = useHistory()

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.user || [])
  const storeUserData = useSelector(state => state.auth.userData || {})
  const storeRole = useSelector(state => state.role || [])
  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [columnsSearch, setColumnsSearch] = useState(["firstName", "lastName", "email", "role"])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentRole, setCurrentRole] = useState({ value: '', label: 'Seleccione Rol' })
  const [isOpenModal, openModal, closeModal] = useModal(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const roleOptions = useOptionsSelectModules(storeRole.allData)

  const isTokenValid = useMemo(() => isTokenActive())

  useEffect(() => {
    if (storeRole.allData.length === 0) {
      dispatch(getRoles())
    }
  }, [storeRole.allData.length])

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
      dispatch(
        getUsersPaginate({
          page: currentPage,
          perPage: rowsPerPage,
          role: currentRole.value,
          columns: columnsSearch,
          sort: "_id",
          sortDirection: "desc",
          searchTerm
        })
      ).catch((error) => {
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
    }

    if (!isObjEmpty(store.selectedItem)) {
      dispatch({
        type: types.delItemSelected
      })
    }

  }, [dispatch, store.data.length])


  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(
      getUsersPaginate({
        page: page.selected + 1,
        perPage: rowsPerPage,
        role: currentRole.value,
        columns: columnsSearch,
        sort: "_id",
        sortDirection: "desc",
        searchTerm
      })
    ).catch((error) => {
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
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getUsersPaginate({
        page: currentPage,
        perPage: value,
        role: currentRole.value,
        columns: columnsSearch,
        sort: "_id",
        sortDirection: "desc",
        searchTerm
      })
    ).catch((error) => {
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
    setRowsPerPage(value)
  }

  useEffect(() => {
    dispatch(
      getUsersPaginate({
        page: currentPage,
        perPage: rowsPerPage,
        role: currentRole.value,
        columns: columnsSearch,
        sort: "_id",
        sortDirection: "desc",
        searchTerm: debouncedSearchTerm
      })
    ).catch((error) => {
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
  }, [debouncedSearchTerm])

  const sorting = (column, direction, event) => {
    console.log("sorting", event)
    dispatch(
      getUsersPaginate({
        columns: columnsSearch,
        page: currentPage,
        perPage: rowsPerPage,
        sort: column.selector,
        sortDirection: direction,
        searchTerm
      })
    ).catch((error) => {
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
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.total / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        onSort={sorting}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
      />
    )
  }

  const handleChangeSelect = (roleId) => {
    dispatch(
      getUsersPaginate({
        page: currentPage,
        perPage: rowsPerPage,
        role: roleId,
        columns: columnsSearch,
        sort: "_id",
        sortDirection: "desc",
        searchTerm
      })
    ).catch((error) => {
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
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      role: currentRole.value,
      searchTerm
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      return store.allData.slice(0, rowsPerPage)
    }
  }

  return (
    <Fragment>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to='#'> Inicio </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <Link to='/apps/user/list'>Usuarios</Link>
        </BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filtro</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
              <Select
                isClearable={true}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={roleOptions}
                value={currentRole}
                onChange={data => {
                  if (data !== null) {
                    setCurrentRole(data)
                    handleChangeSelect(data.value)
                  } else {
                    setCurrentRole({ value: '', label: 'Seleccione Rol' })
                    handleChangeSelect('')
                  }
                }}
              />
            </Col>
            <Col md='8'>
              <div className="float-right">
                <Can I="create" a="user">
                  <Button.Ripple color='primary' onClick={openModal} key={4} outline>
                    Agregar
                  </Button.Ripple>
                  <ErrorBoundary>
                    <ModalNewItem isOpen={isOpenModal} closeModal={closeModal} props={props} />
                  </ErrorBoundary>
                </Can>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <DataTable
          noHeader
          pagination
          subHeader
          responsive
          paginationServer
          columns={columns}
          sortIcon={<ChevronDown />}
          className='react-dataTable'
          paginationComponent={CustomPagination}
          data={dataToRender()}
          subHeaderComponent={
            <CustomHeader
              handlePerPage={handlePerPage}
              rowsPerPage={rowsPerPage}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}

            />
          }
        />
      </Card>

    </Fragment>
  )
}

export default UsersList
