import { useNavigate } from "react-router-dom"
import { Footer } from "../components/auth/Footer"
import { Navbar } from "../components/auth/Navbar"
export const Home = () => {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/login")
  }
  return (
    <>
      <Navbar />
      <div>Home</div>
      <Footer />
    </>
  )
}
