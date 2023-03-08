import { useState } from "react"

export const useIsLogued = (initialValue = true) => {
    const [isLogued, setIsLogued] = useState(initialValue)

    const userLogued = () => setIsLogued(true)
    const userLogout = () => setIsLogued(false)
    return [isLogued, userLogued, userLogout]
}