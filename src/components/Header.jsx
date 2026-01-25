import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // NAV CONFIG
  const navLinks = useMemo(
    () => [
      { path: "/", label: "Home" },
      { path: "about", label: "About", scroll: true },
      { path: "skills", label: "Skills", scroll: true },
      { path: "/projects", label: "Projects" },
      { path: "contact", label: "Contact", scroll: true },
    ],
    []
  );

  // HANDLE SECTION SCROLL
 const handleNavClick = (e, link) => {
  if (!link.scroll) {
    closeMenu();
    return;
  }

  e.preventDefault();

  navigate("/", {
    state: { scrollTo: link.path },
  });

  closeMenu();
};

  // Active highlight only for route pages
  const isActive = (path) => {
    return location.pathname === path && !path.includes("#");
  };

  return (
    <motion.nav
      className={`header ${isScrolled ? "scrolled" : ""}`}
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" className="logo" onClick={closeMenu}>
          Vishnu <span>sharma</span>
        </Link>

        {/* MOBILE BUTTON */}
        <button
          className="menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* MOBILE MENU */}
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
                    to={link.scroll ? "/" : link.path}
                    onClick={(e) =>
                      handleNavClick(e, link)
                    }
                    className={
                      isActive(link.path)
                        ? "active"
                        : ""
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* DESKTOP */}
        <ul className="nav-links desktop">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.scroll ? "/" : link.path}
                onClick={(e) =>
                  handleNavClick(e, link)
                }
                className={
                  isActive(link.path)
                    ? "active"
                    : ""
                }
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
