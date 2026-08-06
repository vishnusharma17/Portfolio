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
import { trackLinkClick } from "../services/api";
import "./ContactForm.css";

const InfoCard = ({ icon, title, value, link }) => (
  <div className="contact-info-card">
    <div className="contact-icon">{icon}</div>
    <h3>{title}</h3>
    {link ? (
      <a href={link}>{value}</a>
    ) : (
      <span>{value}</span>
    )}
  </div>
);

const SocialLink = ({ icon, label, url, onClick }) => (
  <a
    className="social-link"
    href={url}
    target={url.startsWith("http") ? "_blank" : undefined}
    rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
    onClick={onClick}
  >
    <span className="social-icon">{icon}</span>
    <span>{label}</span>
  </a>
);

const Field = ({ label, name, value, error, onChange, type = "text" }) => (
  <div className="form-field">
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "error" : ""}
      autoComplete="on"
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);

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

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name required";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last name required";

    if (!formData.email.trim()) {
      newErrors.email = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.subject.trim())
      newErrors.subject = "Subject required";

    if (!formData.message.trim())
      newErrors.message = "Message required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const body = [
        `Name: ${fullName}`,
        `Email: ${formData.email}`,
        "",
        formData.message,
      ].join("\n");

      const mailto = `mailto:${contactInfo.email}?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialClick = useCallback((type, url) => {
    trackLinkClick(type, url);
  }, []);

  return (
    <div className="contact-main">
      <div className="contact-left">
        <h2>Get In Touch</h2>
        <p className="contact-lead">
          Prefer email? Reach out directly or use the form — it opens your mail
          app with the message ready.
        </p>

        <div className="contact-info-grid">
          <InfoCard
            icon={<FaPhone />}
            title="Phone"
            value={contactInfo.phone}
            link={socialLinks.phone}
          />

          <InfoCard
            icon={<FaEnvelope />}
            title="Email"
            value={contactInfo.email}
            link={socialLinks.email}
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
                handleSocialClick("linkedin", socialLinks.linkedin)
              }
            />
          </div>
        </div>
      </div>

      <div className="contact-right">
        <motion.form onSubmit={handleSubmit}>
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

          <Field
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />

          <Field
            label="Subject"
            name="subject"
            value={formData.subject}
            error={errors.subject}
            onChange={handleChange}
          />

          <div className="message">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? "error" : ""}
            />
            {errors.message && (
              <span className="error-message">{errors.message}</span>
            )}
          </div>

          <div className="btn">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Opening..." : "Send Message"}
            </button>
          </div>

          {submitStatus === "success" && (
            <p className="success-message">
              Your email app should open with the message ready.
            </p>
          )}

          {submitStatus === "error" && (
            <p className="error-message-box">
              Could not open mail. Email me at {contactInfo.email}.
            </p>
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default ContactForm;
