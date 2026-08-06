import { motion } from 'framer-motion'
import { useContent } from '../context/ContentContext'
import { getIcon } from '../utils/iconMap'
import './Skills.css'

const Skills = () => {
  const { content } = useContent()
  const skills = content?.skills || []

  return (
    <section id="skills" className="skills-section">
      <motion.div
        className="skills-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Skills & Technologies</h2>
        <p>Technologies I work with</p>
      </motion.div>

      <div className="skills-grid">
        {skills.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            className="skill-category"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          >
            <h3>{category.category}</h3>
            <div className="skills-list">
              {(category.items || []).map((skill, index) => {
                const Icon = getIcon(skill.icon)
                return (
                  <motion.div
                    key={skill.name}
                    className="skill-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="skill-header">
                      <span className="skill-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <motion.div
                        className="skill-progress"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Skills
