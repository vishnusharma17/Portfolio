import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FaCode, FaLaptopCode, FaRocket, FaStar } from "react-icons/fa";
import "./Stats.css";

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    {
      number: 5,
      label: "Projects Completed",
      icon: FaRocket,
    },
    {
      number: 5,
      label: "Technologies Mastered",
      icon: FaLaptopCode,
    },
    {
      number: 50,
      label: "Code Commits",
      icon: FaCode,
    },
    {
      number: 6,
      label: "Months Experience",
      icon: FaStar,
    },
  ];

  return (
    <section ref={ref} className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="stat-icon">
                <Icon />
              </div>

              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.2,
                  type: "spring",
                }}
              >
                {stat.number}+
              </motion.div>

              <div className="stat-label">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Stats;
