import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, UserPlus, Sparkles, ArrowRight } from "lucide-react";

const RegisterCard = ({ to, title, icon: Icon, description, variant = "primary" }) => {
  const variants = {
    primary: "from-accent to-accent-dark",
    secondary: "from-secondary to-secondary-dark"
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={to}
        className="block group relative overflow-hidden rounded-[2.5rem] p-1 bg-gradient-to-br from-white/20 to-transparent border border-white/10 backdrop-blur-xl shadow-2xl"
      >
        <div className="bg-white/5 dark:bg-primary-light/10 p-10 rounded-[2.3rem] h-full flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${variants[variant]} flex items-center justify-center mb-8 shadow-xl shadow-black/20 group-hover:rotate-12 transition-transform duration-500`}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          <h3 className="text-3xl font-black text-primary dark:text-white mb-4 tracking-tight">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed max-w-[240px]">
            {description}
          </p>

          <div className="flex items-center gap-3 text-accent font-black group-hover:gap-5 transition-all uppercase tracking-[0.2em] text-xs">
            Start Journey <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const Register = () => {
  return (
    <div className="min-h-screen flex pt-20 items-center justify-center bg-surface-soft dark:bg-primary-dark p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent/10 text-accent font-black text-xs uppercase tracking-widest mb-8 border border-accent/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Join the Evolution</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-primary dark:text-white tracking-tighter leading-none"
          >
            Begin Your <br /> <span className="text-accent underline decoration-secondary/30 underline-offset-8">Transformation</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <RegisterCard
            to="/register/student"
            title="Student"
            icon={GraduationCap}
            description="Find your path and connect with expert mentors."
            variant="primary"
          />
          <RegisterCard
            to="/register/counselor"
            title="Counselor"
            icon={Briefcase}
            description="Share your expertise and guide the next generation."
            variant="secondary"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 text-gray-400 font-bold"
        >
          Already part of the community? <Link to="/login" className="text-accent hover:text-accent-light transition-colors">Sign in here</Link>
        </motion.p>
      </div>
    </div>
  );
};
