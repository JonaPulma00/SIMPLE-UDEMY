import { useNavigate } from "react-router-dom"
export const Login = () => {


  const navigate = useNavigate()


  return (
    <>
      <div>Login</div>
      <button onClick={() => navigate(-1)}>Go Back</button>
      <button onClick={() => navigate(1)}>Go Forward</button>
    </>
  )
}
