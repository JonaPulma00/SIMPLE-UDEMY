import { Navbar } from "../components/Navbar"
import { ParticlesComponent } from "../components/ParticlesComponent"
import { useForm } from "../hooks/useForm"

export const InstructorRegister = () => {

  const initialForm = {
    username: '',
    email: '',
    password: '',
    is_instructor: ''
  }
  const { username, email, password, is_instructor, onInputChange, formState } = useForm()
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
