import { AppRoutes } from "./router/routes"
import { UserProvider } from "./context/UserProvider"
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {
  return (
    <GoogleOAuthProvider clientId="149066278626-1sfsa01j3ib30038mmchar8h89j64nu1.apps.googleusercontent.com">
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </GoogleOAuthProvider>
  )
}

export default App
