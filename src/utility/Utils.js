
import themeConfig from '@configs/themeConfig'
import jwtDecode from 'jwt-decode'
const baseUrl = process.env.REACT_APP_API_URL

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

export const capitalizarFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const gotoFile = (file) => {
  //console.log("dd", file)  
  window.open(baseUrl + file)
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
// default
// export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
//   if (!value) return value
//   return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
// }

export const formatDate = (date) => {
  const d = new Date(date)
  d.setDate(d.getDate() + 1)


  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) month = `0${month}`
  if (day.length < 2) day = `0${day}`

  return [day, month, year].join("/")
}

  //Definición de los subjects
  export const typesModules = {
    role: 'role',
    rolePermissions: 'rolePermissions',
    roleModules: 'roleModules',
    user: 'user',
    instance: 'instance'
    
  }

   //Definición de los errores
   export const typesErrors = {
    read: 'Error al obtener los registros, por favor actualice la página',
    update: 'Error al actualizar los registros, por favor actualice la página',
    delete: 'Error al eliminar los registros, por favor actualice la página'
   
  }
  
  //Definición de las habilidades
  export const typesAbilities = {
      read: 'read', 
      created: 'create', 
      updated: 'update', 
      deleted: 'delete'
  } 

export const getImageUser = (image) => {

  if (image) {
    return `${themeConfig.apiUrlImage}${image}`
  } else {
    return `${themeConfig.apiUrlImage}avatar.png`

  }
}

export const getSSmallImageUser = (image) => {

  if (image) {
    return `${themeConfig.apiUrlImage}small-${image}`
  } else {
    return `${themeConfig.apiUrlImage}avatar.png`

  }
}

export const getDefaultDate = (dayAdd = 0) => {
  const someDate = new Date()
  const numberOfDaysToAdd = dayAdd
  const date = someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
  return new Date(date).toISOString().split("T")[0]
}

export const formatDate2 = (date) => {
  const d = new Date(date)
  d.setDate(d.getDate() + 1)


  let month = `${d.getMonth() + 1}`
  let day = `${d.getDate()}`
  const year = d.getFullYear()

  if (month.length < 2) month = `0${month}`
  if (day.length < 2) day = `0${day}`

  return [year, month, day].join("-")
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')

export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

export const getAccessToken = () => {
  const userData = JSON.parse(localStorage.getItem('userData'))
  if (userData) {
     return (userData.accessToken && userData.accessToken !== '') ? userData.accessToken : false
  }
}

export const isTokenActive = () => {
  const token = JSON.parse(localStorage.getItem('userData'))
  let isActive = true
  if (token) {
    const decodedToken = jwtDecode(token.accessToken)
    const currentTime = Date.now() / 1000
    
    if (decodedToken.exp < currentTime) isActive = false
  } else {
    isActive = false
  }
  return isActive
}

export const setServerInstance = (data) => localStorage.setItem('instance', JSON.stringify(data))

export const getServerInstance = () => JSON.parse(localStorage.getItem('instance'))

export const deleteServerInstance = () => localStorage.removeItem('instance')

export const deleteuserData = () => localStorage.removeItem('userData')


/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const refreshTokenSetup = (res) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || ((3600 - 5) * 60)) * 1000

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse()
    refreshTiming = (newAuthRes.expires_in || ((3600 - 5) * 60)) * 1000
    console.log('newAuthRes:', newAuthRes)
    // saveUserToken(newAuthRes.access_token);  <-- save new token
    localStorage.setItem('authToken', newAuthRes.id_token)

    // Setup the other timer after the first one
    setTimeout(refreshToken, refreshTiming)
  }

  // Setup first refresh timer
  setTimeout(refreshToken, refreshTiming)
}

