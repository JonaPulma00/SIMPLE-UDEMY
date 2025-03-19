import { useNavigate } from "react-router-dom"
import { Footer } from "../components/auth/Footer"
import { Navbar } from "../components/auth/Navbar"
import '../styles/Home.css'
export const Home = () => {

  const navigate = useNavigate()


  return (
    <>
      <Navbar />
      <div>Home</div>
      <Footer />
    </>
  )
}
