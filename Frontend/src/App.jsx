import { AppRoutes } from "./router/routes"
import { UserProvider } from "./context/UserProvider"
function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>

  )
}

export default App
