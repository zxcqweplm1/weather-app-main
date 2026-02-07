import { Route, Routes } from "react-router-dom"
import App from "../App"
import Error from "../components/error"


const AppRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/error" element={<Error />} />
    </Routes>
  )
}

export default AppRouter