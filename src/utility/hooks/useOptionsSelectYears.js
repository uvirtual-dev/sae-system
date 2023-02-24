import { useEffect, useState } from "react"

const currentYear = new Date().getFullYear()
export const useOptionsSelectYears = (yearLimit = 4, onlyPast = false) => {
  
    const [options, setOptions] = useState([])
    const arrayOptions = [{value: '', label: 'Seleccione año...'}]
        useEffect(() => {
          if (!onlyPast) {
              for (let year = currentYear + yearLimit; year >= currentYear - yearLimit; year--) {
                arrayOptions.push({ value: year, label: year, _id: year })
              }
              
            } else {
               const year = currentYear - yearLimit
              for (let index = year; index <= currentYear; index++) {
                   arrayOptions.push({ value: index, label: index, _id: index })
                }
            }

          setOptions(arrayOptions)
          
        }, [])
    return options
  }