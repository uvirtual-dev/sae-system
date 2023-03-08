// ** Reactstrap
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, CardTitle, CardText, Table, CustomInput, Button } from 'reactstrap'
import { isObjEmpty } from '../../../../utility/Utils'

const PermissionsTable = () => {
  const dispatch = useDispatch()
  const { register, errors, handleSubmit, control } = useForm({})

  const stateRoleSubjects = useSelector(state => state.roleSubjects.data || [])
  const stateRolePermissions = useSelector(state => state.rolePermissions.data || [])

  const handleChecked = (e, uno, dos) => { 
    console.log(e.target.checked)
    console.log(e.target.name, uno, dos)
  }
  console.log(stateRolePermissions)

  const Cabeceras = () => {
    return stateRolePermissions.map((item, index) => {
      return <th key={index}>{item.name}</th>
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Permissions</CardTitle>
      </CardHeader>
      <CardText className='ml-2'>Permission according to roles</CardText>
      <Table striped borderless responsive>
        <thead className='thead-light'>
          <tr>
            <th>MM</th>
            <Cabeceras />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Admin</td>
            <td>
              <CustomInput name='uno' control={control}
                          innerRef={register()} 
                        type='checkbox' id='admin-1' label='' defaultChecked
                        onClick={(e) => handleChecked(e, 'subject', 'pepe')}  />
            </td>
            <td>
              <CustomInput name='uno'control={control}
              
                          innerRef={register()} type='checkbox' id='admin-2' label=''
                          onClick={handleChecked}  />
            </td>
            <td>
              <CustomInput name='uno' control={control}
                          innerRef={register()} type='checkbox' id='admin-3' label=''
                          onClick={handleChecked}  />
            </td>
            <td>
              <CustomInput name='uno' control={control}
                          innerRef={register()} type='checkbox' id='admin-4' label='' 
                          onClick={handleChecked} />
            </td>
          </tr>
         
        </tbody>
      </Table>
    </Card>
  )
}

export default PermissionsTable
