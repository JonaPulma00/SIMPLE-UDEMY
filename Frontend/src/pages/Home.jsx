import { useNavigate } from "react-router-dom"
import { Footer } from "../components/auth/Footer"
export const Home = () => {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/login")
  }
  return (
    <>
      <div>Home</div>
      <button onClick={handleClick}> Click me</button>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate(1)}>Go Forward</button>

      <Footer />
    </>
  )
}
