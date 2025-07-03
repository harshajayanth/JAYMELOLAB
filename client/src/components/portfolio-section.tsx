import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="portfolio" className="py-20 px-6 bg-darker-gray">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest Work</h2>
            <p className="text-xl text-gray-400">
              Featured projects from film scores to web series soundtracks
            </p>
          </div>
          <motion.a
            href="#"
            className="hidden md:flex items-center space-x-2 text-electric-purple hover:text-purple-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <span>See all</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass rounded-2xl p-4 animate-pulse space-y-4"
                >
                  <div className="w-full h-64 bg-white/10 rounded-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-white/10 rounded"></div>
                    <div className="h-4 w-1/3 bg-white/10 rounded"></div>
                    <div className="h-4 w-full bg-white/10 rounded"></div>
                    <div className="h-4 w-5/6 bg-white/10 rounded"></div>
                  </div>
                </motion.div>
              ))
            : projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="project-card group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = "true";
                            target.src =
                              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          className="px-4 py-2 bg-electric-purple rounded-full text-sm font-medium hover:bg-purple-600 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Listen
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-electric-purple text-sm font-medium mb-3">{project.category}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>

        <div className="text-center mt-12">
          <motion.a
            href="#"
            className="md:hidden inline-flex items-center space-x-2 text-electric-purple hover:text-purple-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <span>See all projects</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
