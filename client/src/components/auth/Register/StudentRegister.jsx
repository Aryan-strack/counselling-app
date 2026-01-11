import { useState } from "react";
import { useAuth } from "../../../context/Context";
import { toast } from "react-toastify";
import { studentSchemaZod } from "../../../zod-validation/studentZod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export const StudentRegister = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    personalInfo: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    role: "student",
  });
  const { postData, storeTokenInLS } = useAuth();
  const [errors, setErrors] = useState({});

  const handleChange = (section, e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [section]: {
        ...data[section],
        [name]: value,
      },
      role: "student",
    });
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = studentSchemaZod.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors(fieldErrors.personalInfo);
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const responseData = await postData(
        `${process.env.BACKEND_URL}/api/register/student`,
        { registerUser: data }
      );
      if (responseData.success) {
        if (responseData.token) {
          await storeTokenInLS(responseData.token);
          toast.success("Welcome to the community!");
          setTimeout(() => navigate("/login/student"), 1500);
        } else {
          toast.success(responseData.message || "Registration successful!");
          setTimeout(() => navigate("/login/student"), 2000);
        }
      } else {
        toast.error(responseData.message || "Registration failed.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during registration.");
    }
  };

  return (
    <div className="min-h-screen flex pt-20 items-center justify-center bg-surface-soft dark:bg-primary-dark p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <Link
          to="/register"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-accent font-bold mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest">Back to Roles</span>
        </Link>

        <div className="bg-white dark:bg-primary-light/10 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white dark:border-white/5 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-accent/10 text-accent shadow-xl">
              <UserPlus size={40} />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-4"
            >
              <Sparkles size={12} className="text-accent" />
              <span>Student Account Creation</span>
            </motion.div>
            <h2 className="text-3xl font-black text-primary dark:text-white tracking-tight">Join the Academy</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={data.personalInfo.name}
                    onChange={(e) => handleChange("personalInfo", e)}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white ${errors.name ? 'border-rose-500/50' : ''}`}
                  />
                  {errors.name && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-4">{errors.name._errors[0]}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={data.personalInfo.email}
                    onChange={(e) => handleChange("personalInfo", e)}
                    placeholder="name@university.edu"
                    className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white ${errors.email ? 'border-rose-500/50' : ''}`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-4">{errors.email._errors[0]}</p>}
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={data.personalInfo.password}
                      onChange={(e) => handleChange("personalInfo", e)}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white ${errors.password ? 'border-rose-500/50' : ''}`}
                    />
                    {errors.password && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-4">{errors.password._errors[0]}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Confirm</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={data.personalInfo.confirmPassword}
                      onChange={(e) => handleChange("personalInfo", e)}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white ${errors.confirmPassword ? 'border-rose-500/50' : ''}`}
                    />
                    {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-4">{errors.confirmPassword._errors[0]}</p>}
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-primary dark:bg-accent text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 dark:shadow-accent/20 hover:shadow-2xl transition-all mt-6"
            >
              Create Account <UserPlus size={18} />
            </motion.button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-sm font-medium text-gray-500">
              Already have an account?{" "}
              <Link to="/login/student" className="text-accent font-black hover:underline uppercase tracking-widest text-xs ml-1">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
