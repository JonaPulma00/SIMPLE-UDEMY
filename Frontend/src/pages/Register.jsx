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
    e.prevendDefault();

    try {
      await registerUser.register(formState)
      navigate('/myEd/dashboard')
    } catch (error) {
      setError('Error in registration, try again')
    }
  }
  return (
    <>
      <Navbar />
      <div className="general-container">
        <div className="wrapper">
          <form action="">
            <h1>Register</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" />
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="input-box">
              <input type="email" placeholder="Email" />
              <i className="fa-sharp fa-solid fa-envelope"></i>
            </div>

            <div className="input-box">
              <input type="password" placeholder="Password" />
              <i className="fa-sharp-duotone fa-solid fa-lock"></i>
            </div>
            <button type="submit" className="btn">Register</button>
          </form>
        </div>
      </div>
    </>
  )
}
