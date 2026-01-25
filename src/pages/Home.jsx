import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { FaRocket } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

import ContactForm from "../components/ContactForm";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import Skills from "../components/Skills";
import Stats from "../components/Stats";

import { projects } from "../data/projects";
import "./Home.css";

const Home = () => {
  const contactRef = useRef(null);
  const featuredProjects = useMemo(
    () => projects.slice(0, 3),
    []
  );

  const { state } = useLocation();

  // 🔥 AUTO SCROLL FROM HEADER (ANY PAGE)
  useEffect(() => {
    if (state?.scrollTo) {
      const el = document.getElementById(
        state.scrollTo
      );

      if (el) {
        setTimeout(() => {
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 150);
      }
    }
  }, [state]);

  return (
    <div className="home">
      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= STATS ================= */}
      <Stats />

      {/* ================= ABOUT ================= */}
      <section id="about" className="about-section">
        <div className="about-container">
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="about-header">
              <h2>About Me</h2>
              <div className="about-divider"></div>
            </div>

            <div className="about-main-content">
              <div className="about-text">
                <p className="about-intro">
                  I'm{" "}
                  <span className="highlight">
                    Vishnu Sharma
                  </span>{" "}
                  — a passionate Web Developer
                  with expertise in building
                  modern, responsive web
                  applications.
                </p>

                <p>
                  With a strong foundation
                  in frontend technologies
                  like React, JavaScript,
                  and modern CSS, I bring
                  ideas to life through
                  clean code and innovative
                  design solutions.
                </p>

                <p>
                  When I'm not coding, I
                  enjoy exploring new
                  design trends,
                  contributing to
                  open-source projects,
                  and sharing knowledge
                  with the developer
                  community.
                </p>
              </div>

              <div className="about-stats-mini">
                <div className="stat-mini">
                  <div className="stat-number-mini">
                    6+
                  </div>
                  <div className="stat-label-mini">
                    Months Experience
                  </div>
                </div>

                <div className="stat-mini">
                  <div className="stat-number-mini">
                    5+
                  </div>
                  <div className="stat-label-mini">
                    Projects Done
                  </div>
                </div>

                <div className="stat-mini">
                  <div className="stat-number-mini">
                    5+
                  </div>
                  <div className="stat-label-mini">
                    Technologies
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURES */}
            <div className="about-features">
              <motion.div
                className="feature-item"
                initial={{
                  opacity: 0,
                  scale: 0.85,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -6,
                }}
              >
                <span className="feature-icon">
                  ✨
                </span>
                <h4>Modern Design</h4>
                <p>
                  Creating visually
                  stunning and intuitive
                  interfaces
                </p>
              </motion.div>

              <motion.div
                className="feature-item"
                initial={{
                  opacity: 0,
                  scale: 0.85,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -6,
                }}
              >
                <span className="feature-icon">
                  <FaRocket />
                </span>
                <h4>Fast Performance</h4>
                <p>
                  Optimized code for
                  lightning-fast load
                  times
                </p>
              </motion.div>

              <motion.div
                className="feature-item"
                initial={{
                  opacity: 0,
                  scale: 0.85,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.3,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -6,
                }}
              >
                <span className="feature-icon">
                  📱
                </span>
                <h4>Responsive</h4>
                <p>
                  Perfect experience on
                  all devices
                </p>
              </motion.div>

              <motion.div
                className="feature-item"
                initial={{
                  opacity: 0,
                  scale: 0.85,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: 0.4,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -6,
                }}
              >
                <span className="feature-icon">
                  💡
                </span>
                <h4>Creative Solutions</h4>
                <p>
                  Innovative approaches
                  to complex problems
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SKILLS ================= */}
      <section id="skills">
        <Skills />
      </section>

      {/* ================= PROJECTS ================= */}
      <section
        id="projects"
        className="projects-section-home"
      >
        <motion.div
          className="project-heading"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1>Projects</h1>
        </motion.div>

        <div className="projects-container">
          {featuredProjects.map(
            (project, index) => (
              <ProjectCard
                key={project.name}
                project={project}
                index={index}
              />
            )
          )}
        </div>

        <motion.div
          className="show-more-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/projects">
            <motion.button
              className="show-more"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              Show More Projects..
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ================= CONTACT ================= */}
      <section
        id="contact"
        ref={contactRef}
        className="contact-section"
      >
        <motion.div
          className="contact-heading"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1>Contact</h1>
        </motion.div>

        <ContactForm />
      </section>
    </div>
  );
};

export default Home;
