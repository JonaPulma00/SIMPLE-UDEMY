import { AppRoutes } from "./router/routes"
import { UserProvider } from "./context/UserProvider"
import { GoogleOAuthProvider } from "@react-oauth/google"

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </GoogleOAuthProvider>
  )
}

export default App
