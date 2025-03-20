import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import "../styles/Login.css"
export const Login = () => {
  const navigate = useNavigate()
  return (
    <>
      <Navbar />
      <div className="general-container">
        <div className="wrapper">
          <form action="">
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" />
              <i class="fa-solid fa-user"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" />
              <i class="fa-sharp-duotone fa-solid fa-lock"></i>
            </div>
            <div className="remember-forget">
              <label ><input type="checkbox" />
                Remember me</label>
              <NavLink to='/' > Forgot Password?</NavLink>
            </div>
            <button type="submit" className="btn">Log in</button>
            <div className="register-link">
              <p>Don't have a account?  <NavLink to='/register' >Register</NavLink></p>
            </div>
          </form>
          {/* <button onClick={() => navigate(-1)}>Go Back</button>
          <button onClick={() => navigate(1)}>Go Forward</button> */}
        </div>
      </div>
    </>
  )
}
