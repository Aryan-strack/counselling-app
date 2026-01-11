import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/Context";
import { useNavigate, useParams, Link } from "react-router-dom";
import { counselingSessionSchemaZod } from "../../zod-validation/counselingSessionZod";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, GraduationCap, Clock, Tag,
  MapPin, Calendar, Star, FileText,
  ChevronLeft, Sparkles, CheckCircle2, ShieldCheck, Mail
} from "lucide-react";

export const CounselorProfile = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  const { fetchData, isLoggedIn } = useAuth();
  const { counselorId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const responseData = await fetchData(`${process.env.BACKEND_URL}/api/counselorProfile/${counselorId}`);
        if (responseData.success) {
          setProfileData(responseData.data || {});
          const slotsData = await fetchData(`${process.env.BACKEND_URL}/api/counselorAvailableSlots/${counselorId}`);
          if (slotsData.success) {
            setAvailableSlots(slotsData.data || []);
          }
        }
      } catch (error) {
        toast.error("Profile fetch failed");
      }
    };
    fetchingData();
  }, [counselorId, fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Please pick a time!");
      return;
    }

    const startDate = moment(selectedDate).format("YYYY-MM-DD HH:mm:ss");
    const result = counselingSessionSchemaZod.safeParse({ date: startDate });

    if (!result.success) {
      setErrors(result.error.format());
      return;
    }

    const sessionData = {
      counselorId: profileData?._id,
      startDate,
      price: profileData.counseling?.price,
      endDate: moment(selectedDate).add(1, "hour").format("YYYY-MM-DD HH:mm:ss"),
      duration: profileData.counseling?.duration,
    };

    const targetPath = isLoggedIn ? "/payment" : "/login/student";
    const navState = isLoggedIn
      ? { state: { navigateToPayment: "/payment", scheduleSessionData: sessionData } }
      : { state: { navigateToPayment: "/payment", scheduleSessionData: sessionData } };

    navigate(targetPath, navState);
  };

  const isSlotAvailable = (date) => !availableSlots.some(slot => moment(slot).isSame(moment(date), "minute"));

  if (!profileData?._id) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-soft dark:bg-primary-dark">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-soft dark:bg-primary-dark pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <Link to="/counselorList" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent font-bold mb-8 transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest">Explore Counselors</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-primary-light/10 backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl border border-white dark:border-white/5 text-center overflow-hidden relative"
            >
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-accent/20 via-secondary/10 to-transparent" />

              <div className="relative mb-6 pt-4">
                <img
                  src={`${process.env.BACKEND_URL}/images/${profileData?.profile}`}
                  alt={profileData.personalInfo.name}
                  className="w-32 h-32 rounded-[2.5rem] object-cover mx-auto shadow-2xl border-4 border-white dark:border-primary-dark"
                />
                <div className="mt-6">
                  <h1 className="text-3xl font-black text-primary dark:text-white tracking-tight mb-1">{profileData.personalInfo.name}</h1>
                  <p className="text-accent text-xs font-black uppercase tracking-[0.2em]">{profileData.counseling?.category?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex justify-center gap-6 py-6 border-y border-gray-100 dark:border-white/5 my-6">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-xl font-black text-emerald-500">${profileData.counseling?.price}</p>
                </div>
                <div className="w-px bg-gray-100 dark:border-white/5" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Exp.</p>
                  <p className="text-xl font-black text-primary dark:text-white">{profileData.counselor?.education.experience}y</p>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{profileData.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span>{profileData.counseling?.duration} min sessions</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-accent/5 rounded-[2.5rem] p-8 border border-accent/10"
            >
              <h4 className="text-sm font-black text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={18} /> Verified Expert
              </h4>
              <p className="text-xs font-medium text-accent/80 leading-relaxed uppercase tracking-widest">
                This counselor has been thoroughly vetted and matches our elite standards for professional guidance.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Detailed Info & Booking */}
          <div className="lg:col-span-8 space-y-10">
            {/* Bio & Education */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-primary-light/5 backdrop-blur-xl rounded-[3rem] p-10 shadow-xl border border-white dark:border-white/5"
            >
              <div className="mb-10">
                <h3 className="text-2xl font-black text-primary dark:text-white mb-6 flex items-center gap-3">
                  <Star className="text-secondary" /> About Counselor
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-[2] text-lg">
                  {profileData.counselor?.education.description || "Leading expert in their field, providing professional guidance for career and personal development."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <GraduationCap className="w-8 h-8 text-accent mb-4" />
                  <h4 className="text-lg font-black text-primary dark:text-white mb-2">Academic Background</h4>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{profileData.counselor?.education.degree}</p>
                  <p className="text-sm font-medium text-gray-400">{profileData.counselor?.education.institution}</p>
                </div>
                {profileData.counselor?.file && (
                  <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <FileText className="w-8 h-8 text-secondary mb-4" />
                    <h4 className="text-lg font-black text-primary dark:text-white mb-2">Credentials</h4>
                    <a
                      href={`${process.env.BACKEND_URL}/files/${profileData.counselor?.file}`}
                      target="_blank" rel="noopener"
                      className="inline-flex items-center gap-2 text-xs font-black text-accent uppercase tracking-widest hover:underline"
                    >
                      View Certification <Sparkles size={14} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Booking Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary-dark rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

              <div className="relative">
                <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                  <Calendar className="text-secondary" /> Reserve Your Session
                </h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                  <div className="md:col-span-8 flex flex-col gap-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Select Date & Time</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => { setSelectedDate(date); setErrors({}); }}
                      showTimeSelect
                      dateFormat="Pp"
                      placeholderText="Choose a convenient time..."
                      className="w-full px-8 py-5 rounded-2xl bg-white/10 border border-white/10 focus:border-secondary focus:bg-white/20 outline-none transition-all font-bold text-white text-lg"
                      minDate={moment().add(1, "hour").toDate()}
                      filterTime={(time) => moment(time).minute() === 0 && isSlotAvailable(time)}
                    />
                    {errors.date && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1 ml-4">{errors?.date?._errors[0]}</p>}
                  </div>

                  <div className="md:col-span-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-5 rounded-2xl bg-secondary text-primary-dark font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-secondary/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                    >
                      Book Now <CheckCircle2 size={18} />
                    </motion.button>
                  </div>
                </form>

                <div className="mt-8 flex items-center gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reserved</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
