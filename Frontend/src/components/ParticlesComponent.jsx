import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, memo } from "react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "../context/ThemeContext";

export const ParticlesComponent = memo((props) => {
  const { theme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    })
  }, []);

  const particleColor = theme === "dark" ? "#FFFFFF" : "#000";
  const linkColor = theme === "dark" ? "#FFFFFF" : "#000";

  const options = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "repulse",
        },
        onHover: {
          enable: true,
          mode: 'grab',
        },
      },
      modes: {
        push: {
          distance: 200,
          duration: 15,
        },
        grab: {
          distance: 150,
        },
      },
    },
    particles: {
      color: {
        value: particleColor,
      },
      links: {
        color: linkColor,
        distance: 120,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: true,
        speed: 1.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          value: 1200,
        },
        value: 100,
      },
      opacity: {
        value: 1.0,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  }

  return <Particles id={props.id} options={options} />;
});

