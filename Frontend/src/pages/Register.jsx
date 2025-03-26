import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { useForm } from "../hooks/useForm"
import { useState } from "react"
import { registerUser } from "../services/authService"
import { ParticlesComponent } from "../components/ParticlesComponent"
import '../styles/user/authForms.css'
export const Register = () => {

  const navigate = useNavigate()
  const initialForm = {
    username: '',
    email: '',
    password: '',
    confirm: '',
    is_instructor: false
  }
  const { username, email, password, confirm, is_instructor, formState, onInputChange } = useForm(initialForm)

  const [error, setError] = useState('')

  const confirmPassword = () => {
    if (confirm != password) {
      setError('Passwords must match!')
      return false;
    } else {
      return true;
    }
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!confirmPassword()) return;
    try {
      const response = await registerUser.register({
        username: formState.username,
        email: formState.email,
        password: formState.password,
        is_instructor: formState.is_instructor
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error", error);
      if (error.detail) {
        if (Array.isArray(error.detail)) {
          setError(error.detail.map(err => err.msg).join(', '));
        } else {
          setError(error.detail);
        }
      } else {
        setError('Error in registration, try again');
      }
      setTimeout(() => setError(''), 10000);
    }
  }
  return (
    <>
      <div className="page-wrapper">
        <ParticlesComponent id='particles' />
        <div className="content-wrapper">
          <Navbar />
          <form className="general-container" onSubmit={onSubmit}>
            <div className="wrapper">
              <h1>Register</h1>
              <div className="input-box">
                <label htmlFor="name" className="form-label">
                  <input
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    value={username}
                    name="username"
                    onChange={onInputChange}
                    autoFocus />
                </label>
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="input-box">
                <label htmlFor="email" className="form-label">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    name="email"
                    className="form-input"
                    onChange={onInputChange} />
                </label>
                <i className="fa-sharp fa-solid fa-envelope"></i>
              </div>

              <div className="input-box">
                <label htmlFor="password" className="form-label">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    name="password"
                    onChange={onInputChange} />
                </label>
                <i className="fa-sharp-duotone fa-solid fa-lock"></i>
              </div>

              <div className="input-box">
                <label htmlFor="password" className="form-label">
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirm}
                    name="confirm"
                    onChange={onInputChange} />
                </label>
                <i className="fa-sharp-duotone fa-solid fa-lock"></i>
              </div>
              <div className="confirm-choice">
                <label htmlFor="is_instructor" className="instructor-label">
                  <input
                    type="checkbox"
                    id="is_instructor"
                    name="is_instructor"
                    className="instructor-checkbox"
                    checked={is_instructor}
                    onChange={onInputChange}
                  />
                  <span className="checkbox-text">I want to be an instructor</span>
                </label>
              </div>
              <button type="submit" className="btn">Register</button>
              {error && <p className="error-message">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
