import {
  FaBolt,
  FaBootstrap,
  FaCode,
  FaCss3Alt,
  FaDatabase,
  FaGitAlt,
  FaHtml5,
  FaJs,
  FaLaptopCode,
  FaLightbulb,
  FaMagic,
  FaMobileAlt,
  FaNodeJs,
  FaPaperPlane,
  FaReact,
  FaRocket,
  FaStar,
} from 'react-icons/fa'

const ICONS = {
  react: FaReact,
  js: FaJs,
  html: FaHtml5,
  css: FaCss3Alt,
  bootstrap: FaBootstrap,
  node: FaNodeJs,
  database: FaDatabase,
  git: FaGitAlt,
  bolt: FaBolt,
  mobile: FaMobileAlt,
  paperPlane: FaPaperPlane,
  rocket: FaRocket,
  laptop: FaLaptopCode,
  code: FaCode,
  star: FaStar,
  magic: FaMagic,
  lightbulb: FaLightbulb,
}

export function getIcon(name) {
  return ICONS[name] || FaCode
}
