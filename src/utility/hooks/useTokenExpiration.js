// import { useState, useEffect } from 'react'

// export const useTokenExpiration = (token) => {
//   const [isExpired, setIsExpired] = useState(false)

//   useEffect(() => {
//     const tokenExpiration = new Date(token.exp)
//     const now = new Date() / 1000
//     const hasExpired = now > tokenExpiration

//     setIsExpired(hasExpired)

//     const interval = setInterval(() => {
//       const hasExpired = now > tokenExpiration

//       setIsExpired(hasExpired)
//     }, 60000)

//     return () => clearInterval(interval)
//   }, [token])

//   return [isExpired]
// }
import { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'

export const useTokenExpiration = (token) => {
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000

    if (decodedToken.exp < currentTime) {
      setIsExpired(true)
    }
  }, [token])

  return [isExpired]
}


// import { useState, useEffect } from "react"
// import jwtDecode from 'jwt-decode'

// const getTokenExpiration = (token) => {
//   const decodedToken = jwtDecode(token)
//   const expirationDate = decodedToken.exp
//   const now = Date.now() / 1000
//   return expirationDate - now
// }

// export const useTokenExpiration = (token) => {
//   const [isExpired, setIsExpired] = useState(false)

//   const isTokenExpired = (expirationTime) => {
//     return expirationTime <= 0
//   }

//   useEffect(() => {
//     const tokenExpiration = getTokenExpiration(token)
//     const timeout = setTimeout(() => {
//       const expired = isTokenExpired(tokenExpiration)
//       setIsExpired(expired)
//      }, tokenExpiration)

//      return () => clearTimeout(timeout)
//   }, [token])

//   return [isExpired]
// }

