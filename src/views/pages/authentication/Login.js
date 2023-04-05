import { useState, useContext, Fragment } from 'react'
import Avatar from '@components/avatar'
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { Link, useHistory } from 'react-router-dom'
import { isObjEmpty } from '@utils'
import {  Coffee } from 'react-feather'
import { useGoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../../../utility/Utils'

import {
  Alert,
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Button,
  Toast, ToastBody, ToastHeader
} from 'reactstrap'

import '@styles/base/pages/page-auth.scss'
import handleError from '../../../utility/handle.error'

//Import SWAL
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const MySwal = withReactContent(Swal)

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

const close = (
  <button type='button' className='ml-1 close'>
    <span>×</span>
  </button>
)

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Bienvenido, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Iniciaste sesión correctamente con el rol {role}. Bienvenido!</span>
    </div>
  </Fragment>
)
const ToastLoginError = (error) => (
  <Fragment>
      <Toast>
          <ToastHeader close={close} icon='warning'>
             {error} 
          </ToastHeader>
        <ToastBody>El usuario o contraseña no son correctos</ToastBody>
      </Toast>
  </Fragment>
)

const Login = props => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { register, errors, handleSubmit } = useForm()
  const illustration = skin === 'dark' ? 'logo-uvirtual-dark-2023.webp' : 'logo-uvirtual-dark-2023.webp',
    source = require(`@src/assets/images/uvirtual/${illustration}`).default

    const onSuccess = (response) => {
      if (isObjEmpty(errors)) {
        useJwt
        .google({ id_token: response.tokenId})
        .then(res => {
            const data = { ...res.data.userData, expiresIn: res.data.expiresIn, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
            dispatch(handleLogin(data))
            console.log(res)
            ability.update(res.data.userData.ability)
            history.push('/apps/instance/view')
            toast.success(
              <ToastContent name={data.fullName || data.username} role={data.role} />,
              { transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
          })
          .catch(error => {
            console.log('ERROOORRRR', error)
            const { message, status } = handleError(error)
            const msgHtml = (status === 401 || status === 403) ? `Por favor inicie sesión! <br>. <p class="text-danger">${message}<p>` : `Por favor actualice la página! <br>. <p class="text-danger">${message}<p>`
            MySwal.fire({
              title: `Error! ${status}`,
              html: msgHtml,
              icon: "error",
              buttonsStyling: true,
              showConfirmButton: false
            })
                 
          })
      }
  
      refreshTokenSetup(response)
  
    }
    const onFailure = (res) => {
     
      if (!res === "popup_closed_by_use") {
          toast.warn(
                  <ToastLoginError error={res}/>,
                { transition: Slide, hideProgressBar: true, autoClose: 2000 }
                )
      }
    }
  
    const onSubmit = data => {
      
      if (isObjEmpty(errors)) {
        console.log("onSubmit")
  
        useJwt
          .login({ email, password })
          .then(res => {
            const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
            dispatch(handleLogin(data))
   
            ability.update(res.data.userData.ability)
            history.push('/apps/instance/view')
            toast.success(
              <ToastContent name={data.fullName || data.username} role={data.role} />,
              { transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
          })
          .catch(err => console.log(err))
      }
    }
    const { signIn } = useGoogleLogin({
      onSuccess,
      onFailure,
      clientId: googleClientId,
      isSignedIn: false,
      accessType: 'offline'
    })

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <h2 className='brand-text text-primary ml-1'>UVirtual</h2>
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login V2' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              SysSae - UVirtual 👋
            </CardTitle>
            <CardText className='mb-2'>Por favor inicia sesión:</CardText>
             <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <Button.Ripple color='primary' block onClick={signIn}>
                Inicia sesión con Google
              </Button.Ripple>
            </Form>
        
            
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
