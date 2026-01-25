import { FaGitAlt, FaHtml5, FaJs, FaNodeJs, FaReact } from "react-icons/fa";

import { SiMongodb, SiTailwindcss, SiVite } from "react-icons/si";

export const skills = [
  {
    category: "Frontend",
    items: [
      { name: "React", level: 80, icon: FaReact },
      { name: "JavaScript", level: 85, icon: FaJs },
      { name: "HTML/CSS", level: 95, icon: FaHtml5 },
      { name: "Tailwind CSS", level: 80, icon: SiTailwindcss },
      { name: "Bootstrap", level: 75, icon: FaHtml5 },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 80, icon: FaNodeJs },
      { name: "Express", level: 75, icon: FaNodeJs },
      { name: "MongoDB", level: 70, icon: SiMongodb },
    ],
  },
  {
    category: "Tools & Others",
    items: [
      { name: "Git/Github", level: 85, icon: FaGitAlt },
      { name: "Vite", level: 90, icon: SiVite },
      { name: "Responsive Design", level: 95, icon: FaReact },
      { name: "Postman", level: 70, icon: FaNodeJs },
      { name: "Thunder client", level: 70, icon: FaNodeJs },
    ],
  },
];
