import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Navbar } from "../components/Navbar"
export const Register = () => {

  const navigate = useNavigate()
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
          {/* <button onClick={() => navigate(-1)}>Go Back</button>
          <button onClick={() => navigate(1)}>Go Forward</button> */}
        </div>
      </div>
    </>
  )
}
