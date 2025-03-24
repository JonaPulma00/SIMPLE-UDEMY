import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import "../styles/global/Home.css";
import iconLearn from '../assets/home/study.png';
import iconTeacher from '../assets/home/teacher.png';
import iconCode from '../assets/home/code.png';
import { ParticlesComponent } from "../components/ParticlesComponent";
export const Home = () => {
  const navigate = useNavigate();

  const topics = [
    "JavaScript",
    "TypeScript",
    "Java",
    "Vue",
    "Python",
    "TDD",
    "React",
    "C++",
    "UI/UX Design",
    "Angular"
  ];

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-wrapper">
      <ParticlesComponent id="particles" />
      <div className="content-wrapper">
        <Navbar />
        <section className="hero-section">
          <div className="hero-content">
            <h1>Learn new skills, advance your career</h1>
            <p>
              Choose from hundred online courses
            </p>
            <form className="search-container" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="What do you want to learn?"
                aria-label="Search for courses"
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </section>

        {/* Popular Topics Section */}
        <section className="topics-section">
          <h2>Popular Topics</h2>
          <div className="topics-container">
            {topics.map((topic, index) => (
              <button key={index} className="topic-button">
                {topic}
              </button>
            ))}
          </div>
        </section>

        <section className="benefits-section">
          <h2>Benefits of using MyEd</h2>
          <div className="benefits-container">
            <div className="benefit-card">
              <img alt="student-img" src={iconLearn || "/placeholder.svg"} className="benefit-icon" />
              <h3>Learn at your own pace!</h3>
              <p>Enjoy lifetime access to courses on our website</p>
            </div>
            <div className="benefit-card">
              <img alt="student-img" src={iconTeacher || "/placeholder.svg"} className="benefit-icon" />
              <h3>Learn from experts</h3>
              <p>Select any course you want from our instructors</p>
            </div>
            <div className="benefit-card">
              <img alt="student-img" src={iconCode || "/placeholder.svg"} className="benefit-icon" />
              <h3>Find video courses to improve your knwoledge</h3>
              <p>Build your own library, with your own courses</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Become an instructor</h2>
            <p>
              Instructors from around the world teach hundreds of students. We
              provide the tools and skills to teach what you love.
            </p>
            <button className="cta-button" onClick={() => navigate("/jsak")}>
              Start Teaching Today
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};
