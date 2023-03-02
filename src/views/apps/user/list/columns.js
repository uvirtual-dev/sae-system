// ** React Imports
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { getSSmallImageUser } from "@utils"

const MySwal = withReactContent(Swal)

// ** Custom Components
import Avatar from "@components/avatar"

// ** Store & Actions
import { getItem, deleteItem, setEditOn } from "../store/action"
import { store } from "@store/storeConfig/store"

// ** Third Party Components
import { Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap"
import { Trash2, Edit, MoreVertical, FileText, Archive } from "react-feather"

import { Can } from '../../../../utility/context/Can'

// ** Renders Client Columns
const renderClient = (row) => {
  const stateNum = Math.floor(Math.random() * 6),
    states = [
      "light-success",
      "light-danger",
      "light-warning",
      "light-info",
      "light-primary",
      "light-secondary"
    ],
    color = states[stateNum]
  if (!!row.image) {
    if (row.image.length) {
      return (
        <Avatar
          className="mr-1"
          img={getSSmallImageUser(row.image)}
          width="32"
          height="32"
        />
      )
    } else {
      return (
        <Avatar
          color={color || "primary"}
          className="mr-1"
          content={row.name || "John Doe"}
          initials
        />
      )
    }
  } else {
    return <span></span>
  }
}

export const columns = [
  {
    name: "Nombre",
    minWidth: "297px",
    selector: "name",
    sortable: true,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        {renderClient(row)}
        <div className="d-flex flex-column">
          <Link
            to={`/apps/user/view/${row._id}`}
            className="user-name text-truncate mb-0"
            onClick={() => store.dispatch(getItem(row._id))}
          >
            <span className="font-weight-bold">{row.firstName} {row.lastName}</span>
          </Link>
          <small className="text-truncate text-muted mb-0">
            {row.lastname}
          </small>
        </div>
      </div>
    )
  },
  {
    name: "Mail",
    minWidth: "172px",
    selector: "gender",
    sortable: true,
    cell: (row) => <span>{row.email}</span>
  },
  {
    name: "Role",
    minWidth: "138px",
    selector: "city",
    sortable: true,
    cell: (row) => <span className="text-capitalize">{(row.isAdmin) ? 'Super Admin' : row.role.name}</span>
  },
  {
    name: "Actions",
    minWidth: "20px",
    maxWidth: "150px",
    selector: "_id",
    sortable: true,
    cell: (row) => (
      <UncontrolledDropdown>
      <DropdownToggle tag='div' className='btn btn-sm'>
        <MoreVertical size={14} className='cursor-pointer' />
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem
          tag={Link}
          to={`/apps/user/edit/${row._id}`}
          className='w-100'
          // onClick={() => store.dispatch(getUser(row.id))}
        >
          <Archive size={14} className='mr-50' />
          <span className='align-middle'>Editar</span>
        </DropdownItem>
        <DropdownItem className='w-100' 
        // onClick={() => store.dispatch(deleteUser(row.id))}
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
                  store.dispatch(deleteItem(row._id))
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
      // <div>
      //     <Button.Ripple
      //       className="btn-icon mr-50"
      //       outline
      //       color="primary"
      //     ><Link to={`/apps/user/edit/${row._id}`}>
      //         <Edit size={14} />
      //       </Link>
      //     </Button.Ripple>
      //     <Button.Ripple
      //       className="btn-icon"
      //       outline
      //       color="danger"
      //       onClick={() => {
      //         MySwal.fire({
      //           title: "¿Quieres borrar este item?",
      //           icon: "info",
      //           customClass: {
      //             confirmButton: "btn btn-danger mr-2",
      //             cancelButton: "btn btn-primary"
      //           },
      //           showCancelButton: true,
      //           buttonsStyling: true,
      //           confirmButtonText: "Si, Borrarlo",
      //           cancelButtonText: "Cancelar"
      //         }).then((result) => {
      //           if (result.isConfirmed) {
      //             store.dispatch(deleteItem(row._id))
      //           } else if (result.isDenied) {
      //             MySwal.fire("Changes are not saved", "", "info")
      //           }
      //         })
      //       }}
      //     >
      //       <Trash2 size={14} />
      //     </Button.Ripple>
        
      // </div>
    )
  }

]
