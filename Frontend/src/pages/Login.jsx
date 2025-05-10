import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { useForm } from "../hooks/useForm"
import { useState } from "react"
import { loginUser } from "../services/authService"
import { ParticlesComponent } from "../components/ParticlesComponent"
import { useGoogleLogin } from '@react-oauth/google'
import { saveToken } from "../services/tokenService"
import { useUser } from "../context/UserContext"
import { socketService } from "../services/socketService"
import "../styles/user/authForms.css"
import axios from 'axios'
export const Login = () => {

  const initialForm = {
    username: '',
    password: ''
  }
  const { loadUserFromToken } = useUser()
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

      if (response && response.data && response.data.access_token) {
        saveToken(response.data.access_token);
        await loadUserFromToken();
        navigate('/dashboard');
        setTimeout(() => {
          socketService.connectSocket()
        }, 100)
      }
    } catch (error) {
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
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });

        const response = await loginUser.googleLogin({
          googleId: userInfo.data.sub,
          email: userInfo.data.email,
          name: userInfo.data.name
        });

        if (response && response.data && response.data.access_token) {
          saveToken(response.data.access_token);
          loadUserFromToken();
          navigate('/dashboard');
          socketService.connectSocket()
        }
      } catch (error) {
        setError('Error in Google login, try again');
        setTimeout(() => setError(''), 10000);
      }
    },
    onError: () => {
      setError('Google login failed');
      setTimeout(() => setError(''), 10000);
    }
  });

  return (
    <div className="page-wrapper">
      <ParticlesComponent id="particles" />
      <div className="content-wrapper">
        <Navbar />
        <form className="general-container" onSubmit={onSubmit}>
          <div className="wrapper">
            <h1>Login</h1>
            <div className="input-box">
              <label htmlFor="name" className="form-label">
                <input
                  autoFocus
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
              <i className="fa-sharp-duotone fa-solid fa-lock" />
            </div>
            <div className="remember-forget">
              <label ><input type="checkbox" />
                Remember me</label>
              <NavLink to='/' > Forgot Password?</NavLink>
            </div>
            <button type="submit" className="btn">Log in</button>

            <div className="social-wrapper">
              <div className="social-login">
                <p className="alternative-sing-in">Or sign in with</p>
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  className="google-btn"
                >
                  <i className="fab fa-google"></i> Google
                </button>
              </div>
            </div>

            <div className="register-link">
              <p>Don't have a account?  <NavLink to='/register' >Register</NavLink></p>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  )
}
