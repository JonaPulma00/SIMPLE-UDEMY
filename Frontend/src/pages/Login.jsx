import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
export const Login = () => {
  const navigate = useNavigate()
  return (
    <>
      <div class="wrapper">
        <form action="">
          <h1>Login</h1>
          <div class="input-box">
            <input type="text" placeholder="username" />
            <i class='bx bxs-user'></i>
          </div>
          <div class="input-box">
            <input type="password" placeholder="Password" />
            <i class='bx bxs-lock-alt'></i>
          </div>
          <div class="remember-forget">
            <label ><input type="checkbox" />
              Remember me</label>
            <NavLink to='/' > Forgot Password?</NavLink>
          </div>
          <button type="submit" class="btn">Log in</button>
          <div class="register-link">
            <p>Don't have a account?  <NavLink to='/register' >Register</NavLink></p>
          </div>
        </form>
      </div>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate(1)}>Go Forward</button>
    </>
  )
}
