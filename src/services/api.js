// API service for backend communication

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.emailjs.com/api/v1.0/email/send'

// EmailJS configuration (you can replace this with your own backend)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_portfolio'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_portfolio'
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'

/**
 * Submit contact form
 * @param {Object} formData - Form data object
 * @returns {Promise<Object>} Response object
 */
export const submitContactForm = async (formData) => {
  try {
    // Option 1: Using EmailJS (for frontend-only solution)
    if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_public_key') {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            from_name: `${formData.firstName} ${formData.lastName}`,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'vishnusharma983j@gmail.com',
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return { success: true, message: 'Message sent successfully!' }
    }

    // Option 2: Using custom backend API
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/contact'
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to send message')
    }

    const data = await response.json()
    return { success: true, message: data.message || 'Message sent successfully!' }
  } catch (error) {
    console.error('Contact form error:', error)
    
    // Fallback: Log to console and show success (for development)
    if (import.meta.env.DEV) {
      console.log('Form Data:', formData)
      return { success: true, message: 'Message logged (development mode)' }
    }
    
    throw new Error(error.message || 'Something went wrong. Please try again later.')
  }
}

/**
 * Track link clicks (analytics)
 * @param {string} linkType - Type of link (github, linkedin, etc.)
 * @param {string} url - URL that was clicked
 */
export const trackLinkClick = async (linkType, url) => {
  try {
    // You can integrate with analytics service here
    if (import.meta.env.DEV) {
      console.log(`Link clicked: ${linkType} - ${url}`)
    }
    
    // Example: Send to analytics API
    // await fetch('/api/analytics/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type: linkType, url, timestamp: Date.now() })
    // })
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

