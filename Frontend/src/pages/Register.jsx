import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { useForm } from "../hooks/useForm"
import { useState } from "react"
import { registerUser } from "../services/authService"
export const Register = () => {

  const navigate = useNavigate()

  const initialForm = {
    username: '',
    email: '',
    password: ''
  }
  const { username, email, password, formState, onInputChange } = useForm({ initialForm })

  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser.register({
        username: formState.username,
        email: formState.email,
        password: formState.password
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error", error);
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'An error occurred. Try again.');
      } else {
        setError('Error in registration, try again');
      }
      setTimeout(() => setError(''), 5000);
    }
  }
  return (
    <>
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
                onChange={onInputChange} />
            </label>
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="input-box">
            <label htmlFor="name" className="form-label">
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
            <label htmlFor="name" className="form-label">
              <input
                type="password"
                placeholder="Password"
                value={password}
                name="password"
                onChange={onInputChange} />
            </label>
            <i className="fa-sharp-duotone fa-solid fa-lock"></i>
          </div>
          <button type="submit" className="btn">Register</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </>
  )
}
