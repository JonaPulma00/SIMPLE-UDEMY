import { Navbar } from "../components/Navbar"
import { ParticlesComponent } from "../components/ParticlesComponent"
import { useForm } from "../hooks/useForm"
import { useNavigate } from "react-router-dom"
import '../styles/user/authForms.css'

export const InstructorRegister = () => {
  const navigate = useNavigate()
  const initialForm = {
    username: '',
    email: '',
    password: '',
    is_instructor: ''
  }

  const { username, email, password, is_instructor, onInputChange, formState } = useForm(initialForm)

  return (
    <>
      <div className="general-wrapper">
        <div id='particles'>
          <ParticlesComponent />
          <Navbar />
        </div>
      </div>
    </>
  )
}
