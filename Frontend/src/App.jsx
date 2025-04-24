import { AppRoutes } from "./router/routes"
import { UserProvider } from "./context/UserProvider"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import './styles/custom/toasts.css'
import { ThemeProvider } from "./context/ThemeProvider"

function App() {
  return (
    <>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <UserProvider>
            <AppRoutes />
          </UserProvider>
        </GoogleOAuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="dark"
          style={{ width: 'auto' }}
          toastStyle={{ 
            backgroundColor: '#111',
            color: '#fff',
            margin: '0',
            padding: '8px 12px'
          }}
        />
      </ThemeProvider>
    </>
  )
}

export default App
