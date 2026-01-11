import React from "react";
import { Briefcase, Star, Clock, Tag, User, MapPin, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export const CounselorCard = ({
  counselorData,
  handlCounselorProfile,
  toggleCounselor,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white dark:bg-primary-light/10 rounded-[2.5rem] p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5 overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-accent/10 transition-colors" />

      {/* Profile Image & Status Badge */}
      <div className="relative mb-6 flex justify-center">
        <div className="relative">
          <img
            src={`${process.env.BACKEND_URL}/images/${counselorData?.profile}`}
            alt={counselorData.personalInfo?.name}
            className="w-28 h-28 rounded-3xl object-cover shadow-2xl border-4 border-white dark:border-primary-dark group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = "/default-avatar.png" }}
          />
          <div className="absolute -bottom-2 -right-2 bg-secondary text-primary-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            {counselorData.counselor?.education?.experience || "Expert"}
          </div>
        </div>
      </div>

      {/* Name & Identity */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-primary dark:text-white mb-1 group-hover:text-accent transition-colors tracking-tight">
          {counselorData.personalInfo?.name}
        </h3>
        <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">
          {counselorData.counseling?.category?.replace('_', ' ') || "Counselor"}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <Briefcase className="w-5 h-5 text-gray-400 mb-1" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</span>
          <span className="text-sm font-bold dark:text-gray-200">{counselorData.counselor?.education?.experience || "5+ Years"}</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
          <Tag className="w-5 h-5 text-gray-400 mb-1" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</span>
          <span className="text-sm font-bold dark:text-gray-200">${counselorData.counseling?.price}/hr</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => handlCounselorProfile(e, counselorData?._id)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary dark:bg-accent text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 dark:shadow-accent/20 hover:shadow-2xl transition-all"
        >
          View Full Profile
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {toggleCounselor && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => toggleCounselor(e, counselorData?._id)}
            className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] border-2 transition-all ${counselorData.status === "active"
                ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white"
                : "border-rose-500/20 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white"
              }`}
          >
            {counselorData.status === "active" ? "Disable Access" : "Grant Access"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
