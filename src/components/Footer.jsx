import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { trackLinkClick } from "../services/api";
import "./Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { content } = useContent();
  const contact = content?.contact || {};
  const social = content?.social || {};
  const name = content?.profile?.name || "Vishnu Sharma";

  const handleLinkClick = (type, url) => {
    if (url) trackLinkClick(type, url);
  };

  const handleScrollToSection = (e, sectionId) => {
    e.preventDefault();
    const onHome = location.pathname === "/" || location.pathname === "";
    if (onHome) {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      navigate({ pathname: "/", hash: sectionId }, { replace: true });
    } else {
      navigate({ pathname: "/", hash: sectionId });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="f-col">
          <h4>Contact</h4>
          {social.phone && (
            <a
              href={social.phone}
              onClick={() => handleLinkClick("phone", social.phone)}
            >
              <FaPhone /> {contact.phone}
            </a>
          )}
          {social.email && (
            <a
              href={social.email}
              onClick={() => handleLinkClick("email", social.email)}
            >
              <FaEnvelope /> {contact.email}
            </a>
          )}
        </div>

        <div className="f-col">
          <h4>Quick Links</h4>
          <div className="q-links">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Home
            </Link>
            <Link
              to={{ pathname: "/", hash: "about" }}
              onClick={(e) => handleScrollToSection(e, "about")}
            >
              About
            </Link>
            <Link to="/projects">Projects</Link>
            <Link
              to={{ pathname: "/", hash: "contact" }}
              onClick={(e) => handleScrollToSection(e, "contact")}
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="f-col">
          <h4>Location</h4>
          <p>
            <FaMapMarkerAlt /> {contact.location}
          </p>

          <div className="footer-social">
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                onClick={() => handleLinkClick("github", social.github)}
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
                onClick={() => handleLinkClick("linkedin", social.linkedin)}
              >
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="copyright">
        <p>
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
