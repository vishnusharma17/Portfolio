import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { contactInfo, socialLinks } from "../config/links";
import { trackLinkClick } from "../services/api";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();

  const handleLinkClick = (type, url) => {
    if (url) trackLinkClick(type, url);
  };

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    navigate("/", { state: { scrollTo: sectionId } });
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="f-col">
          <h4>Contact</h4>
          <a
            href={socialLinks.phone}
            onClick={() => handleLinkClick("phone", socialLinks.phone)}
          >
            <FaPhone /> {contactInfo.phone}
          </a>
          <a
            href={socialLinks.email}
            onClick={() => handleLinkClick("email", socialLinks.email)}
          >
            <FaEnvelope /> {contactInfo.email}
          </a>
        </div>

        <div className="f-col">
          <h4>Quick Links</h4>
          <div className="q-links">
            <Link
              to="/"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            >
              Home
            </Link>
            <Link
              to="/"
              onClick={(e) => handleScrollToSection(e, "about")}
            >
              About
            </Link>
            <Link to="/projects">Projects</Link>
            <Link
              to="/"
              onClick={(e) => handleScrollToSection(e, "contact")}
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="f-col">
          <h4>Location</h4>
          <p>
            <FaMapMarkerAlt /> {contactInfo.location}
          </p>

          <div className="footer-social">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={() =>
                handleLinkClick("github", socialLinks.github)
              }
            >
              <FaGithub />
            </a>

            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              onClick={() =>
                handleLinkClick("linkedin", socialLinks.linkedin)
              }
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="copyright">
        <p>
          © {new Date().getFullYear()} Vishnu Sharma. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
