import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-500" },
    { icon: Twitter, href: "#", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-500" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { icon: Github, href: "#", color: "hover:text-gray-400" },
  ];

  return (
    <footer className="relative bg-primary-dark text-white pt-24 pb-12 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Identity */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center rotate-3">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="text-2xl font-black tracking-tight">
                Student<span className="text-secondary">Counselor</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
              Empowering students through professional guidance and expert mentorship for a brighter future.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -3 }}
                  className={`p-2 rounded-lg bg-white/5 border border-white/5 transition-colors ${social.color}`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Quick Nav</h4>
            <ul className="space-y-4">
              {["Home", "Counselors", "About Us", "Services", "Success Stories"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : "#"}
                    className="text-gray-400 hover:text-secondary text-sm font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400 group cursor-pointer hover:text-white transition-colors">
                <MapPin size={18} className="text-accent shrink-0" />
                <span>123 Expert Avenue, <br />Education District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400 group cursor-pointer hover:text-white transition-colors">
                <Phone size={18} className="text-accent shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400 group cursor-pointer hover:text-white transition-colors">
                <Mail size={18} className="text-accent shrink-0" />
                <span>support@studentcounselor.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white tracking-wide">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-6 font-medium leading-relaxed">
              Subscribe to our newsletter for latest educational trends and success tips.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-accent transition-all pl-5 pr-12"
              />
              <button className="absolute right-2 top-1.5 bg-accent p-2 rounded-xl text-white hover:scale-105 transition-transform">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom area */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <p>&copy; {currentYear} StudentCounselor AI. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/login/admin" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
