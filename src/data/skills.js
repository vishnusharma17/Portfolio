import {
  FaBolt,
  FaBootstrap,
  FaCss3Alt,
  FaDatabase,
  FaGitAlt,
  FaHtml5,
  FaJs,
  FaMobileAlt,
  FaNodeJs,
  FaPaperPlane,
  FaReact,
} from "react-icons/fa";

export const skills = [
  {
    category: "Frontend",
    items: [
      { name: "React", level: 80, icon: FaReact },
      { name: "JavaScript", level: 85, icon: FaJs },
      { name: "HTML/CSS", level: 95, icon: FaHtml5 },
      { name: "Tailwind CSS", level: 80, icon: FaCss3Alt },
      { name: "Bootstrap", level: 75, icon: FaBootstrap },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 80, icon: FaNodeJs },
      { name: "Express", level: 75, icon: FaNodeJs },
      { name: "MongoDB", level: 70, icon: FaDatabase },
    ],
  },
  {
    category: "Tools & Others",
    items: [
      { name: "Git/Github", level: 85, icon: FaGitAlt },
      { name: "Vite", level: 90, icon: FaBolt },
      { name: "Responsive Design", level: 95, icon: FaMobileAlt },
      { name: "Postman", level: 70, icon: FaPaperPlane },
      { name: "Thunder client", level: 70, icon: FaBolt },
    ],
  },
];
