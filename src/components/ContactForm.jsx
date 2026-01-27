import {
  FaClock,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";

import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import { contactInfo, socialLinks } from "../config/links";
import { trackLinkClick } from "../services/api";
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

    if (!formData.email.trim())
      newErrors.email = "Email required";

    if (!formData.subject.trim())
      newErrors.subject = "Subject required";

    if (!formData.message.trim())
      newErrors.message = "Message required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ EMAILJS SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          from_name:
            formData.firstName +
            " " +
            formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "YOUR_PUBLIC_KEY"
      );

      setSubmitStatus("success");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
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
      {/* LEFT */}
      <div className="contact-left">
        <h1>Get In Touch</h1>

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
            />

            <SocialLink
              icon={<FaLinkedin />}
              label="LinkedIn"
              url={socialLinks.linkedin}
            />
          </div>
        </div>
      </div>

      {/* RIGHT */}
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
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Sending..."
              : "Send Message"}
          </button>

          {submitStatus === "success" && (
            <p className="success-message">
              ✅ Message sent!
            </p>
          )}

          {submitStatus === "error" && (
            <p className="error-message-box">
              ❌ Failed to send.
            </p>
          )}
        </motion.form>
      </div>
    </div>
  );
};

export default ContactForm;
