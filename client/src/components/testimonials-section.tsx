import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@shared/schema";
import axios from "axios";

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const {
    data: testimonials = [],
    isLoading,
    isError,
    error,
  } = useQuery<Testimonial[]>({
    queryKey: ["testimonials", "featured"],
    queryFn: async () => {
      const res = await axios.get("/api/testimonials/featured");
      return res.data ?? [];
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="testimonials" className="py-20 px-6 bg-darker-gray">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Clients Say
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Testimonials from filmmakers, content creators, and production
            companies
          </p>
        </motion.div>

        {/* Errors */}
        {isError && (
          <p className="text-red-400 text-center">
            Failed to load testimonials: {(error as Error)?.message}
          </p>
        )}

        {/* Testimonials Grid */}
        <motion.div
          ref={ref}
          className="grid md:grid-cols-1 lg:grid-cols-2 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="rounded-xl p-8 animate-pulse bg-white/5 space-y-4 min-h-[240px]"
                >
                  <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                  <div className="h-4 w-full bg-white/10 rounded"></div>
                  <div className="h-4 w-5/6 bg-white/10 rounded"></div>
                  <div className="flex items-center mt-6 space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 bg-white/10 rounded"></div>
                      <div className="h-3 w-24 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            : testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={itemVariants}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-all duration-300 shadow-lg flex flex-col justify-between max-h-[400px] overflow-hidden"
                  whileHover={{ scale: 1.015 }}
                >
                  {/* Star Rating */}
                  <div className="flex items-center text-yellow-400 mb-4">
                    {[...Array(testimonial.rating || 0)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="overflow-y-auto pr-2 mb-6 custom-scroll max-h-[200px]">
                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line break-words">
                      {testimonial.content}
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center mt-auto">
                    <img
                      src={testimonial.avatarUrl ?? "/default-avatar.png"}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-white text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}
