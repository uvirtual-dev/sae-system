// ** Auth Endpoints
export default {
  loginEndpoint: `${process.env.REACT_APP_API_URL}/api/auth/login`,
  loginGoogleEndpoint: `${process.env.REACT_APP_API_URL}/api/auth/google`,
  // loginEndpoint: '/jwt/login',
  // registerEndpoint: '/jwt/register',
  // refreshEndpoint: '/jwt/refresh-token',
  // logoutEndpoint: '/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
