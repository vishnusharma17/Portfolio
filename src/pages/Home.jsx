import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import ContactForm from "../components/ContactForm";
import Hero from "../components/Hero";
import ProjectCard from "../components/ProjectCard";
import Skills from "../components/Skills";
import Stats from "../components/Stats";
import { useContent } from "../context/ContentContext";
import { getIcon } from "../utils/iconMap";
import "./Home.css";

const Home = () => {
  const contactRef = useRef(null);
  const { content } = useContent();
  const location = useLocation();

  const featuredProjects = useMemo(() => {
    const projects = content?.projects || [];
    const featured = projects.filter((p) => p.featured);
    return (featured.length ? featured : projects).slice(0, 3);
  }, [content]);

  const about = content?.about || {};
  const miniStats = content?.miniStats || [];

  useEffect(() => {
    const sectionId =
      (location.hash && location.hash.replace("#", "")) ||
      location.state?.scrollTo;

    if (!sectionId) return;

    const timer = setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);

    return () => clearTimeout(timer);
  }, [location.hash, location.state]);

  return (
    <div className="home">
      <Hero />
      <Stats />

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
              {about.image ? (
                <motion.div
                  className="about-photo"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <img
                    src={about.image}
                    alt={content?.profile?.name || "About"}
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              ) : null}

              <div className="about-text">
                <p className="about-intro">
                  {about.intro?.includes("Vishnu Sharma") ? (
                    <>
                      {about.intro.split("Vishnu Sharma")[0]}
                      <span className="highlight">Vishnu Sharma</span>
                      {about.intro.split("Vishnu Sharma")[1]}
                    </>
                  ) : (
                    about.intro
                  )}
                </p>

                {(about.paragraphs || []).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="about-stats-mini">
                {miniStats.map((stat) => (
                  <div className="stat-mini" key={stat.label}>
                    <div className="stat-number-mini">{stat.number}</div>
                    <div className="stat-label-mini">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-features">
              {(about.highlights || []).map((feature, index) => {
                const Icon = getIcon(feature.icon);
                return (
                  <motion.div
                    key={feature.title}
                    className="feature-item"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
                  >
                    <span className="feature-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <Skills />

      <section id="projects" className="projects-section-home">
        <motion.div
          className="project-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1>Projects</h1>
        </motion.div>

        <div className="projects-container">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id || project.name}
              project={project}
              index={index}
            />
          ))}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Show More Projects
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <section id="contact" ref={contactRef} className="contact-section">
        <motion.div
          className="contact-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
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
