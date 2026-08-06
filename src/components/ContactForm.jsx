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

import { useContent } from "../context/ContentContext";
import { submitContactForm, trackLinkClick } from "../services/api";
import "./ContactForm.css";

const InfoCard = ({ icon, title, value, link }) => (
  <div className="contact-info-card">
    <div className="contact-icon">{icon}</div>
    <h3>{title}</h3>
    {link ? <a href={link}>{value}</a> : <span>{value}</span>}
  </div>
);

const SocialLink = ({ icon, label, url, onClick }) => (
  <a
    className="social-link"
    href={url}
    target={url?.startsWith("http") ? "_blank" : undefined}
    rel={url?.startsWith("http") ? "noopener noreferrer" : undefined}
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
  const { content } = useContent();
  const contact = content?.contact || {};
  const social = content?.social || {};

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
    if (!formData.email.trim()) {
      newErrors.email = "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject required";
    if (!formData.message.trim()) newErrors.message = "Message required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitContactForm(formData);
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
          Send a message through the form. If the API is offline, your email app
          opens instead.
        </p>

        <div className="contact-info-grid">
          <InfoCard
            icon={<FaPhone />}
            title="Phone"
            value={contact.phone}
            link={social.phone}
          />
          <InfoCard
            icon={<FaEnvelope />}
            title="Email"
            value={contact.email}
            link={social.email}
          />
          <InfoCard
            icon={<FaMapMarkerAlt />}
            title="Location"
            value={contact.location}
          />
          <InfoCard
            icon={<FaClock />}
            title="Available"
            value={contact.availability}
          />
        </div>

        <div className="social-links-contact">
          <h3>Follow Me</h3>
          <div className="social-icons">
            {social.github && (
              <SocialLink
                icon={<FaGithub />}
                label="GitHub"
                url={social.github}
                onClick={() => handleSocialClick("github", social.github)}
              />
            )}
            {social.linkedin && (
              <SocialLink
                icon={<FaLinkedin />}
                label="LinkedIn"
                url={social.linkedin}
                onClick={() => handleSocialClick("linkedin", social.linkedin)}
              />
            )}
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
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>

          {submitStatus === "success" && (
            <p className="success-message">Message sent successfully.</p>
          )}
          {submitStatus === "error" && (
            <p className="error-message-box">
              Failed to send. Email me at {contact.email}.
            </p>
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default ContactForm;
