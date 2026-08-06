import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { content } = useContent();

  const displayName = content?.profile?.name || "Vishnu Sharma";
  const [first, ...rest] = displayName.split(" ");
  const last = rest.join(" ");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const navLinks = useMemo(
    () => [
      { path: "/", label: "Home", type: "route" },
      { path: "about", label: "About", type: "section" },
      { path: "skills", label: "Skills", type: "section" },
      { path: "/projects", label: "Projects", type: "route" },
      { path: "contact", label: "Contact", type: "section" },
    ],
    []
  );

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavClick = (e, link) => {
    if (link.type !== "section") {
      closeMenu();
      return;
    }

    e.preventDefault();

    const onHome =
      location.pathname === "/" || location.pathname === "";

    if (onHome) {
      scrollToSection(link.path);
      navigate({ pathname: "/", hash: link.path }, { replace: true });
    } else {
      navigate({ pathname: "/", hash: link.path });
    }

    closeMenu();
  };

  const isActive = (link) => {
    if (link.type === "route") {
      return location.pathname === link.path;
    }
    return (
      (location.pathname === "/" || location.pathname === "") &&
      location.hash === `#${link.path}`
    );
  };

  return (
    <motion.nav
      className={`header ${isScrolled ? "scrolled" : ""}`}
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        <Link
          to="/"
          className="logo"
          onClick={() => {
            closeMenu();
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          {first} {last ? <span>{last}</span> : null}
        </Link>

        <button
          className="menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.ul
              className="nav-links mobile"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.type === "section" ? { pathname: "/", hash: link.path } : link.path}
                    onClick={(e) => handleNavClick(e, link)}
                    className={isActive(link) ? "active" : ""}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <ul className="nav-links desktop">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.type === "section" ? { pathname: "/", hash: link.path } : link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={isActive(link) ? "active" : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Header;
