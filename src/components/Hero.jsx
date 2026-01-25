import { motion } from "framer-motion";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { resumeLink, socialLinks } from "../config/links";
import { trackLinkClick } from "../services/api";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const handleResumeClick = useCallback(() => {
    trackLinkClick("resume", resumeLink);
    window.open(resumeLink, "_blank");
  }, []);

  const handleSocialClick = useCallback((type, url) => {
    trackLinkClick(type, url);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* LEFT CONTENT */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            👋 Full-Stack Web Developer
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Hi, I'm <span className="gradient-text">Vishnu Sharma</span>
          </motion.h1>

          <motion.h2
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            I Build Scalable & High-Performance Web Applications
          </motion.h2>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Specialized in React, Next.js, Node.js, and MongoDB.  
            I focus on writing clean architecture, optimized APIs, and
            production-ready systems that scale.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              className="btn-primary"
              onClick={() => navigate("/projects")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.button>

            <motion.button
              className="btn-secondary"
              onClick={handleResumeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Resume
            </motion.button>
          </motion.div>

          {/* SOCIAL */}
          <motion.div
            className="hero-social"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                handleSocialClick("github", socialLinks.github)
              }
            >
              GitHub
            </a>

            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                handleSocialClick("linkedin", socialLinks.linkedin)
              }
            >
              LinkedIn
            </a>

            <a
              href={socialLinks.email}
              onClick={() =>
                handleSocialClick("email", socialLinks.email)
              }
            >
              Email
            </a>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="image-wrapper dev-style">
            <img src="/images/real.jpeg" alt="Vishnu Sharma" />
            <div className="image-glow"></div>
            <div className="image-frame"></div>
          </div>
        </motion.div>
      </div>

      {/* SCROLL */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span>Scroll Down</span>
        <motion.div
          className="scroll-arrow"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
