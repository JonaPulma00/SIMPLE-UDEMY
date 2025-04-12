import { AppRoutes } from "./router/routes"
import { UserProvider } from "./context/UserProvider"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <AppRoutes />
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
          toastClassName="custom-toast"
        />
      </UserProvider>
    </GoogleOAuthProvider>
  )
}

export default App
