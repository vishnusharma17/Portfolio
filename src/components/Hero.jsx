import { motion } from "framer-motion";
import { useCallback } from "react";
import {
  FaArrowDown,
  FaCode,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { resumeLink, socialLinks } from "../config/links";
import { trackLinkClick } from "../services/api";
import { asset } from "../utils/assets";

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
      <div
        className="hero-media"
        style={{ backgroundImage: `url(${asset("images/real.jpeg")})` }}
        aria-hidden="true"
      />
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="hero-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <FaCode aria-hidden="true" /> Full-Stack Web Developer
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            Vishnu Sharma
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Building clean, scalable web applications with React, Node.js, and
            modern tooling.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <motion.button
              className="btn-primary"
              onClick={() => navigate("/projects")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Projects
            </motion.button>

            <motion.button
              className="btn-secondary"
              onClick={handleResumeClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Download Resume
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-social"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={() => handleSocialClick("github", socialLinks.github)}
            >
              <FaGithub />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              onClick={() =>
                handleSocialClick("linkedin", socialLinks.linkedin)
              }
            >
              <FaLinkedin />
            </a>
            <a
              href={socialLinks.email}
              aria-label="Email"
              onClick={() => handleSocialClick("email", socialLinks.email)}
            >
              <FaEnvelope />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span>Scroll</span>
        <motion.div
          className="scroll-arrow"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FaArrowDown />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
