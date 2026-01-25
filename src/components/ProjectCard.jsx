import { memo } from 'react'
import { motion } from 'framer-motion'
import './ProjectCard.css'

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

  return (
    <motion.div
      className={`project-card ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ scale: 1.02 }}
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
          <div className="project-links">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              GitHub
            </a>
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link primary"
            >
              Live Demo
            </a>
          </div>
        </div>
      </div>
      <div className="p-right">
          <div className="p-image">
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
        </div>
      </div>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'

export default ProjectCard

