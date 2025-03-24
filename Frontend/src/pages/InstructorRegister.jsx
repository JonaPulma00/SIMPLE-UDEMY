import { Navbar } from "../components/Navbar"
import { ParticlesComponent } from "../components/ParticlesComponent"
export const InstructorRegister = () => {
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
