// ** Icons Import
const Footer = () => {
  return (
    <p className="text-center">
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='https://uvirtual.org' target='_blank' rel='noopener noreferrer'>UVirtual</a>
        <span className='d-none d-sm-inline-block'>, Todos los derechos reservados</span>
    </p>
  )
}

export default Footer
