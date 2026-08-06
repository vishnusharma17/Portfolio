import { memo } from 'react'
import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'
import './ProjectCard.css'

const isValidProjectUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  const lower = url.toLowerCase()
  if (lower.includes('yourusername')) return false
  if (lower.includes('-demo.com') || lower.includes('demo.com')) return false
  if (lower.includes('your-ecommerce') || lower.includes('your-bakery')) return false
  if (lower.includes('crime-data-demo')) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const ProjectCard = memo(({ project, index, className = '' }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  const hasGithub = isValidProjectUrl(project.github)
  const hasLiveDemo = isValidProjectUrl(project.liveDemo)

  return (
    <motion.div
      className={`project-card ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="p-left">
        <div className="p-left-inner">
          <h2 className="p-left-h1">{project.name}</h2>
          <p className="p-left-p">{project.description}</p>
          <div className="project-tags">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))}
          </div>
          {(hasGithub || hasLiveDemo) && (
            <div className="project-links">
              {hasGithub && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  <FaGithub aria-hidden="true" /> GitHub
                </a>
              )}
              {hasLiveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link primary"
                >
                  <FaExternalLinkAlt aria-hidden="true" /> Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="p-right">
        <div className="p-image">
          {hasLiveDemo ? (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="image-link"
            >
              <img
                src={project.image}
                alt={project.name}
                loading="lazy"
                decoding="async"
              />
              <div className="image-overlay">
                <span>View Project</span>
              </div>
            </a>
          ) : (
            <div className="image-static">
              <img
                src={project.image}
                alt={project.name}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'

export default ProjectCard
