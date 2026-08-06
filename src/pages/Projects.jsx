import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";
import "./Projects.css";

const ALLOWED_TECH = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "HTML",
  "CSS",
  "JavaScript",
  "Tailwind CSS",
  "Bootstrap",
];

const Projects = () => {
  const [filter, setFilter] = useState("All");

  const allTags = useMemo(() => {
    const techs = projects.flatMap((p) => p.technologies);

    return [
      "All",
      ...new Set(techs.filter((t) => ALLOWED_TECH.includes(t))),
    ];
  }, []);

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) => p.technologies.includes(filter));

  return (
    <div className="projects-page">
      <motion.div
        className="projects-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>My Projects</h1>
        <p>Explore my work and projects</p>
      </motion.div>

      <motion.div
        className="filter-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`filter-btn ${filter === tag ? "active" : ""}`}
            onClick={() => setFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
            />
          ))
        ) : (
          <p className="no-projects">No projects match this filter.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
