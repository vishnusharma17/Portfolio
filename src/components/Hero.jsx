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
import { useContent } from "../context/ContentContext";
import { trackLinkClick } from "../services/api";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const { content } = useContent();
  const profile = content?.profile || {};
  const social = content?.social || {};

  const handleResumeClick = useCallback(() => {
    if (!profile.resume) return;
    trackLinkClick("resume", profile.resume);
    window.open(profile.resume, "_blank");
  }, [profile.resume]);

  const handleSocialClick = useCallback((type, url) => {
    trackLinkClick(type, url);
  }, []);

  return (
    <section className="hero-section">
      <div
        className="hero-media"
        style={{
          backgroundImage: profile.heroImage
            ? `url(${profile.heroImage})`
            : undefined,
        }}
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
            <FaCode aria-hidden="true" /> {profile.title || "Full-Stack Web Developer"}
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {profile.name || "Vishnu Sharma"}
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {profile.tagline}
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
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                onClick={() => handleSocialClick("github", social.github)}
              >
                <FaGithub />
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                onClick={() => handleSocialClick("linkedin", social.linkedin)}
              >
                <FaLinkedin />
              </a>
            )}
            {social.email && (
              <a
                href={social.email}
                aria-label="Email"
                onClick={() => handleSocialClick("email", social.email)}
              >
                <FaEnvelope />
              </a>
            )}
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
