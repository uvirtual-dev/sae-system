import { useEffect, useState } from "react"

export const useOptionsSelectModules = (data = []) => {
    const [options, setOptions] = useState([])
    const arrayOptions = []
    useEffect(() => {
          data.map(item => {
            if (item.status) {
              const label = (item.name) ? item.name : `${item.firstName} ${item.lastName}`
              arrayOptions.push({ value: item._id, label})
            } 
          })
      setOptions(arrayOptions)
    }, [data])
    return options
  }