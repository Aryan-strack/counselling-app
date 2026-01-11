import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCircle, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

const RoleCard = ({ to, title, icon: Icon, description, variant = "primary" }) => {
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
        className="block group relative overflow-hidden rounded-[2rem] p-1 bg-gradient-to-br from-white/20 to-transparent border border-white/10 backdrop-blur-xl shadow-2xl"
      >
        <div className="bg-white/5 dark:bg-primary-light/10 p-8 rounded-[1.8rem] h-full flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${variants[variant]} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:rotate-6 transition-transform duration-500`}>
            <Icon className="w-10 h-10 text-white" />
          </div>

          <h3 className="text-2xl font-black text-primary dark:text-white mb-3 tracking-tight">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed max-w-[200px]">
            {description}
          </p>

          <div className="flex items-center gap-2 text-accent font-bold group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
            Enter Portal <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const Login = () => {
  return (
    <div className="min-h-screen flex pt-20 items-center justify-center bg-surface-soft dark:bg-primary-dark p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Identity Selection</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-primary dark:text-white tracking-tight"
          >
            Welcome Back <br /> <span className="text-accent">Login</span> to Proceed
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RoleCard
            to="/login/student"
            title="Student"
            icon={UserCircle}
            description="Access your dashboard and book counseling sessions."
            variant="primary"
          />
          <RoleCard
            to="/login/counselor"
            title="Counselor"
            icon={ShieldCheck}
            description="Manage your schedule and connect with students."
            variant="secondary"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-gray-500 font-medium"
        >
          New to the platform? <Link to="/register" className="text-accent font-black hover:underline">Create an account</Link>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <Link to="/login/admin" className="text-xs font-bold text-gray-400 hover:text-primary dark:hover:text-white uppercase tracking-widest transition-colors">
            Admin Access
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
