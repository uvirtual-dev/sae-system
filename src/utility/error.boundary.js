import React, {Component} from "react"
import Error from "../views/pages/misc/Error"

class ErrorBoundary extends Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false, messageError: "" }
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true,  messageError: error.message }
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      //logErrorToMyService(error, errorInfo)
      console.log("Component did catch:", error.message, errorInfo)
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        //            <Error error={this.state.messageError}/>

        return (
              <Error error={this.state.messageError}/>
        )
      }
      return this.props.children
    }
  }

  export default ErrorBoundary
