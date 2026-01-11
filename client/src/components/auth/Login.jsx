import React, { useState } from "react";
import { useAuth } from "../../context/Context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowLeft, ShieldCheck, UserCircle, Sparkles } from "lucide-react";

export const LoginPage = ({ role }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { postData, fetchData, storeTokenInLS } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all inputs.");
      return;
    }

    try {
      const responseData = await postData(`${process.env.BACKEND_URL}/api/login`, {
        email,
        role,
        password,
      });

      if (responseData.success) {
        await storeTokenInLS(responseData.token);
        const responseUserData = await fetchData(`${process.env.BACKEND_URL}/api/user`);

        if (responseUserData.success) {
          toast.success("Welcome back!");
          const { role: userRole, friends } = responseUserData.data;

          if (location?.state?.navigateToPayment) {
            navigate(location?.state?.navigateToPayment, { state: { ...location?.state } });
          } else if (userRole === "student" && (!friends || friends.length === 0)) {
            navigate("/counselorList");
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        toast.error(responseData.message || "Login failed.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during login.");
    }
  };

  const RoleIcon = role === "admin" ? ShieldCheck : UserCircle;

  return (
    <div className="min-h-screen flex pt-20 items-center justify-center bg-surface-soft dark:bg-primary-dark p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-accent font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest">Select Different Role</span>
        </Link>

        <div className="bg-white dark:bg-primary-light/10 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white dark:border-white/5 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl ${role === 'student' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
              <RoleIcon size={40} />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-4"
            >
              <Sparkles size={12} className="text-accent" />
              <span>Login as {role}</span>
            </motion.div>
            <h2 className="text-3xl font-black text-primary dark:text-white tracking-tight">Access Your Portal</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                <Link to="/email-reset" className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-primary dark:bg-accent text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 dark:shadow-accent/20 hover:shadow-2xl transition-all"
            >
              Sign In <LogIn size={18} />
            </motion.button>
          </form>

          {role !== "admin" && (
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
              <p className="text-sm font-medium text-gray-500">
                Don't have an account?{" "}
                <Link to={`/register/${role}`} className="text-accent font-black hover:underline uppercase tracking-widest text-xs ml-1">
                  Register Now
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
