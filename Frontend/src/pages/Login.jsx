import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { useForm } from "../hooks/useForm"
import { useState } from "react"
import { loginUser } from "../services/authService"
import "../styles/user/Login.css"
export const Login = () => {

  const initialForm = {
    username: '',
    password: ''
  }
  const navigate = useNavigate()
  const { username, password, onInputChange, formState } = useForm(initialForm)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser.login({
        username: formState.username,
        password: formState.password
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error: ', error);
      if (error.detail) {
        if (Array.isArray(error.detail)) {
          setError(error.detail.map(err => err.msg).join(', '));
        } else {
          setError(error.detail);
        }
      } else {
        setError('Error in login, try again');
      }
      setTimeout(() => setError(''), 10000);
    }
  }
  return (
    <>
      <Navbar />
      <form className="general-container" onSubmit={onSubmit}>
        <div className="wrapper">
          <h1>Login</h1>
          <div className="input-box">
            <label htmlFor="name" className="form-label">
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={onInputChange}
                value={username}
                className="form-input" />
            </label>
            <i className="fa-solid fa-user"></i>
          </div>

          <div className="input-box">
            <label htmlFor="name" className="form-label">
              <input
                type="password"
                placeholder="Password"
                value={password}
                name="password"
                onChange={onInputChange}
                className="form-input" />
            </label>
            <i className="fa-sharp-duotone fa-solid fa-lock"></i>
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
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </>
  )
}
