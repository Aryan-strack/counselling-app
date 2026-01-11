import { useState } from "react";
import { useAuth } from "../../../context/Context.jsx";
import { Link, useNavigate } from "react-router-dom";
import { counselorPersonalInfoSchema, counselorEducationSchema, counselorPaymentSchema } from "../../../zod-validation/counselorZod.js";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, GraduationCap, Briefcase,
  CreditCard, Upload, ChevronRight, ChevronLeft,
  Sparkles, ShieldCheck, CheckCircle2
} from "lucide-react";

export const CounselorRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { postData, storeTokenInLS } = useAuth();

  const [Data, setData] = useState({
    personalInfo: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    education: {
      degree: "",
      institution: "",
      experience: "",
      description: "",
    },
    payment: {
      accountNumber: "",
      bankName: "",
      branchCode: "",
    },
    file: null,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (section, key, value) => {
    if (section === "Files") {
      setData((prev) => ({ ...prev, file: value }));
      setErrors((prev) => ({ ...prev, file: "" }));
    } else {
      setData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
        role: "counselor",
      }));
      if (errors[section]?.[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[section][key];
          return newErrors;
        });
      }
    }
  };

  const validateStep = () => {
    let result;
    if (step === 1) result = counselorPersonalInfoSchema.safeParse({ personalInfo: Data.personalInfo });
    else if (step === 2) result = counselorEducationSchema.safeParse({ education: Data.education, file: Data.file });
    else if (step === 3) result = counselorPaymentSchema.safeParse({ payment: Data.payment });

    if (!result.success) {
      setErrors(result.error.format());
      toast.error("Please complete the required fields.");
      return true;
    }
    setErrors({});
    return false;
  };

  const handleNext = () => !validateStep() && setStep(s => s + 1);
  const handlePrevious = () => setStep(s => Math.max(1, s - 1));

  const submitHandler = async (e) => {
    e.preventDefault();
    if (step === 3) {
      if (validateStep()) return;

      const data = {
        personalInfo: Data.personalInfo,
        education: Data.education,
        payment: Data.payment,
        role: "counselor",
      };

      const formData = new FormData();
      formData.append("registerUser", JSON.stringify(data));
      if (Data.file) formData.append("file", Data.file);

      try {
        const responseData = await postData(`${process.env.BACKEND_URL}/api/register`, formData);
        if (responseData.success) {
          if (responseData.token) await storeTokenInLS(responseData.token);
          toast.success("Welcome aboard! Your profile is under review.");
          setTimeout(() => navigate("/login/counselor"), 2000);
        } else {
          toast.error(responseData.message || "Registration failed.");
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-12">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center">
          <motion.div
            animate={{
              scale: step === num ? 1.2 : 1,
              backgroundColor: step >= num ? "var(--color-accent)" : "rgba(255,255,255,0.05)"
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${step >= num ? "bg-accent text-white shadow-lg shadow-accent/20" : "bg-white/5 text-gray-400"}`}
          >
            {step > num ? <CheckCircle2 size={20} /> : num}
          </motion.div>
          {num < 3 && (
            <div className={`w-8 h-1 mx-2 rounded-full ${step > num ? "bg-accent" : "bg-white/5"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex pt-20 items-center justify-center bg-surface-soft dark:bg-primary-dark p-6 overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="bg-white dark:bg-primary-light/10 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white dark:border-white/5 relative overflow-hidden">
          <Link to="/register" className="absolute top-8 left-8 p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-accent transition-colors">
            <ChevronLeft size={20} />
          </Link>

          <div className="text-center mb-10 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-[10px] uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              <span>Counselor Onboarding</span>
            </div>
            <h2 className="text-3xl font-black text-primary dark:text-white tracking-tight">Expand Your Impact</h2>
          </div>

          <StepIndicator />

          <form onSubmit={submitHandler} className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <h3 className="text-xl font-black text-primary dark:text-white pb-2 flex items-center gap-3 border-b border-gray-100 dark:border-white/5">
                    <User className="text-accent" /> Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                      <input
                        type="text"
                        value={Data.personalInfo.name}
                        onChange={(e) => handleInputChange("personalInfo", "name", e.target.value)}
                        placeholder="Dr. Sarah Johnson"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                      />
                      {errors.personalInfo?.name && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1 ml-4">{errors.personalInfo.name._errors[0]}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                      <input
                        type="email"
                        value={Data.personalInfo.email}
                        onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                        placeholder="sarah@experts.com"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                      />
                      {errors.personalInfo?.email && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1 ml-4">{errors.personalInfo.email._errors[0]}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                      <input
                        type="password"
                        value={Data.personalInfo.password}
                        onChange={(e) => handleInputChange("personalInfo", "password", e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Confirm</label>
                      <input
                        type="password"
                        value={Data.personalInfo.confirmPassword}
                        onChange={(e) => handleInputChange("personalInfo", "confirmPassword", e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <h3 className="text-xl font-black text-primary dark:text-white pb-2 flex items-center gap-3 border-b border-gray-100 dark:border-white/5">
                    <GraduationCap className="text-accent" /> Professional Background
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select
                      onChange={(e) => handleInputChange("education", "degree", e.target.value)}
                      value={Data.education.degree}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-bold text-primary dark:text-white"
                    >
                      <option value="">Select Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="Master's">Master's</option>
                      <option value="Bachelor's">Bachelor's</option>
                    </select>
                    <select
                      onChange={(e) => handleInputChange("education", "experience", e.target.value)}
                      value={Data.education.experience}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-bold text-primary dark:text-white"
                    >
                      <option value="">Select Experience</option>
                      <option value="1 year">1 year</option>
                      <option value="3 years">3 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Briefly describe your counseling style and expertise..."
                    onChange={(e) => handleInputChange("education", "description", e.target.value)}
                    value={Data.education.description}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white min-h-[120px]"
                  />
                  <div className="relative isolate">
                    <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-accent transition-all cursor-pointer">
                      <Upload className="w-8 h-8 text-accent mb-3" />
                      <span className="text-sm font-black uppercase tracking-widest text-primary dark:text-white">{Data.file ? Data.file.name : "Upload Certification (PDF)"}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleInputChange("Files", "file", e.target.files[0])}
                      />
                    </label>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <h3 className="text-xl font-black text-primary dark:text-white pb-2 flex items-center gap-3 border-b border-gray-100 dark:border-white/5">
                    <CreditCard className="text-accent" /> Payout Information
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Bank Name"
                      value={Data.payment.bankName}
                      onChange={(e) => handleInputChange("payment", "bankName", e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        placeholder="Account Number"
                        value={Data.payment.accountNumber}
                        onChange={(e) => handleInputChange("payment", "accountNumber", e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Branch Code"
                        value={Data.payment.branchCode}
                        onChange={(e) => handleInputChange("payment", "branchCode", e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-accent/30 focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-medium text-primary dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
                    <div className="flex gap-3">
                      <ShieldCheck className="text-secondary shrink-0" />
                      <p className="text-[10px] font-medium text-secondary/80 leading-relaxed uppercase tracking-widest">
                        Your payment information is encrypted and securely stored. Payouts are processed every Friday for completed sessions.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 mt-12">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/5 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-primary dark:hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-[2] py-4 rounded-2xl bg-primary dark:bg-accent text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 dark:shadow-accent/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-[2] py-4 rounded-2xl bg-secondary text-primary-dark font-black text-xs uppercase tracking-widest shadow-xl shadow-secondary/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  Complete Registration <CheckCircle2 size={16} />
                </button>
              )}
            </div>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium text-sm">
            Already verified? <Link to="/login/counselor" className="text-accent font-black hover:underline uppercase tracking-widest text-[10px] ml-1">Log in here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
