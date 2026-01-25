import {
  FaClock,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { contactInfo, socialLinks } from "../config/links";
import { submitContactForm, trackLinkClick } from "../services/api";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) =>
      prev[name] ? { ...prev, [name]: "" } : prev
    );
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim())
      newErrors.subject = "Subject is required";

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage("");

      try {
        const result = await submitContactForm(formData);

        if (result.success) {
          setSubmitStatus("success");
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
          });

          setTimeout(() => setSubmitStatus(null), 5000);
        }
      } catch (err) {
        setSubmitStatus("error");
        setErrorMessage(
          err.message || "Failed to send message. Please try again."
        );

        setTimeout(() => {
          setSubmitStatus(null);
          setErrorMessage("");
        }, 5000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate]
  );

  const handleSocialClick = useCallback((type, url) => {
    trackLinkClick(type, url);
  }, []);

  return (
    <div className="contact-main">
      {/* LEFT SIDE */}
      <div className="contact-left">
        <motion.div
          className="c-heading"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h1>Get In Touch</h1>
          <span>
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </span>
        </motion.div>

        {/* INFO GRID */}
        <div className="contact-info-grid">
          <InfoCard
            icon={<FaPhone />}
            title="Phone"
            value={contactInfo.phone}
            link={socialLinks.phone}
            onClick={() =>
              handleSocialClick("phone", socialLinks.phone)
            }
          />

          <InfoCard
            icon={<FaEnvelope />}
            title="Email"
            value={contactInfo.email}
            link={socialLinks.email}
            onClick={() =>
              handleSocialClick("email", socialLinks.email)
            }
          />

          <InfoCard
            icon={<FaMapMarkerAlt />}
            title="Location"
            value={contactInfo.location}
          />

          <InfoCard
            icon={<FaClock />}
            title="Available"
            value={contactInfo.availability}
          />
        </div>

        {/* SOCIAL */}
        <div className="social-links-contact">
          <h3>Follow Me</h3>
          <div className="social-icons">
            <SocialLink
              icon={<FaGithub />}
              label="GitHub"
              url={socialLinks.github}
              onClick={() =>
                handleSocialClick("github", socialLinks.github)
              }
            />
            <SocialLink
              icon={<FaLinkedin />}
              label="LinkedIn"
              url={socialLinks.linkedin}
              onClick={() =>
                handleSocialClick(
                  "linkedin",
                  socialLinks.linkedin
                )
              }
            />
            <SocialLink
              icon={<FaEnvelope />}
              label="Email"
              url={socialLinks.email}
              onClick={() =>
                handleSocialClick("email", socialLinks.email)
              }
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="contact-right">
        <motion.form
          id="contactForm"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="name-section">
            <Field
              label="First Name"
              name="firstName"
              value={formData.firstName}
              error={errors.firstName}
              onChange={handleChange}
            />
            <Field
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              error={errors.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="email-section">
            <Field
              label="Email"
              name="email"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
              type="email"
            />
            <Field
              label="Subject"
              name="subject"
              value={formData.subject}
              error={errors.subject}
              onChange={handleChange}
            />
          </div>

          <div className="message">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? "error" : ""}
            />
            {errors.message && (
              <span className="error-message">
                {errors.message}
              </span>
            )}
          </div>

          {submitStatus === "success" && (
            <div className="success-message">
              ✓ Message sent successfully!
            </div>
          )}

          {submitStatus === "error" && (
            <div className="error-message-box">
              ✗ {errorMessage}
            </div>
          )}

          <div className="btn">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.03 } : {}}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value, link, onClick }) => (
  <motion.div
    className="contact-info-card"
    whileHover={{ y: -6, scale: 1.04 }}
  >
    <div className="contact-icon">{icon}</div>
    <h3>{title}</h3>
    {link ? (
      <a href={link} onClick={onClick}>
        {value}
      </a>
    ) : (
      <span>{value}</span>
    )}
  </motion.div>
);

const SocialLink = ({ icon, label, url, onClick }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="social-link"
    onClick={onClick}
  >
    <span className="social-icon">{icon}</span>
    <span>{label}</span>
  </a>
);

const Field = ({
  label,
  name,
  value,
  error,
  onChange,
  type = "text",
}) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "error" : ""}
    />
    {error && (
      <span className="error-message">{error}</span>
    )}
  </div>
);

export default ContactForm;
