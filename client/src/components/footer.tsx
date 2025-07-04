import { motion } from "framer-motion";
import Waveform from "./waveform";
import {
  FaInstagram,
  FaLinkedin,
  FaMailBulk,
  FaSoundcloud,
  FaYoutube,
} from "react-icons/fa";

const socialLinks = [
  {
    icon: <FaInstagram size={20} />,
    href: "https://www.instagram.com/harshajayanth_?igsh=MXMxcGFrc3c1MWkzdQ%3D%3D&utm_source=qr",
    label: "Instagram",
  },
  {
    icon: <FaYoutube size={20} />,
    href: "https://youtube.com/@jayanthmelodies9920?si=tHzvJAYby4SclWp_",
    label: "Youtube",
  },
  {
    icon: <FaSoundcloud size={20} />,
    href: "#",
    label: "SoundCloud",
  },
];

const services = [
  "Film Scoring",
  "Sound Design",
  "Audio Post-Production",
  "Music Consultation",
];

const contactInfo = [
  {
    icon: (
      <span className="material-icons text-electric-purple text-[20px]">
        email
      </span>
    ),
    text: "jayanthharsha437@gmail.com",
  },
  {
    icon: (
      <span className="material-icons text-electric-purple text-[20px]">
        phone
      </span>
    ),
    text: "+91 94913 64620",
  },
  {
    icon: (
      <span className="material-icons text-electric-purple text-[20px]">
        location_on
      </span>
    ),
    text: "Hyderabad, India",
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-16 px-6 bg-darker-gray border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo + Description + Social */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center space-x-3 mb-6 cursor-pointer"
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
            >
              <Waveform bars={5} height="h-6" />
              <span className="text-xl font-bold gradient-text">
                JAYMELO SOUNDLAB
              </span>
            </motion.div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Crafting cinematic soundscapes that elevate visual storytelling.
              Professional music production for film, web series, and digital
              content.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-electric-purple transition-colors duration-300 text-lg"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3 text-gray-400">
              {services.map((service, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5, color: "#8b5cf6" }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#services"
                    className="hover:text-electric-purple transition-colors duration-300"
                  >
                    {service}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              {contactInfo.map((info, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-electric-purple">{info.icon}</span>
                  <span>{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p>
            &copy; {new Date().getFullYear()} JAYMELO SOUNDLAB. All rights
            reserved. | Created by Harsha Jayanth
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
