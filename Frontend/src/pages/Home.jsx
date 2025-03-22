import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import "../styles/global/Home.css";

export const Home = () => {
  const navigate = useNavigate();

  const topics = [
    "JavaScript",
    "TypeScript",
    "Java",
    "React",
    "Python",
    "TDD",
    "AI",
    "C#",
    "UI/UX Design",
    "Angular"
  ];

  const handleSearch = (e) => {
    e.preventDefault();

  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
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

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2>Why Learn With Us</h2>
        <div className="benefits-container">
          <div className="benefit-card">
            <div className="benefit-icon">🌟</div>
            <h3>Learn at your own pace</h3>
            <p>Enjoy lifetime access to courses on our website and app</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">👨‍🏫</div>
            <h3>Learn from experts</h3>
            <p>Select any course you want from our instructors</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📚</div>
            <h3>Find video courses on almost any topic</h3>
            <p>Build your own library, with your own topics</p>
          </div>
        </div>
      </section>

      {/* Call-To-Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Become an instructor</h2>
          <p>
            Instructors from around the world teach millions of students. We
            provide the tools and skills to teach what you love.
          </p>
          <button className="cta-button" onClick={() => navigate("/teach")}>
            Start Teaching Today
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};
