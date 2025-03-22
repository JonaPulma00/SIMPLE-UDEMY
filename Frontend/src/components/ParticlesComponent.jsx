import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, memo } from "react";
import { loadSlim } from "@tsparticles/slim";



export const ParticlesComponent = memo((props) => {

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    })
  }, []);

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
        value: "#FFFFFF",
      },
      links: {
        color: "#FFFFFF",
        distance: 150,
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
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          value: 1200,
        },
        value: 120,
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

