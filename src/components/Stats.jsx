import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useContent } from "../context/ContentContext";
import { getIcon } from "../utils/iconMap";
import "./Stats.css";

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { content } = useContent();
  const stats = content?.stats || [];

  return (
    <section ref={ref} className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => {
          const Icon = getIcon(stat.icon);

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
