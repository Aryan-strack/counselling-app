import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Context";
import { CounselorCard } from "../Cards/Counselor-Card/CounselorCard";
import { LoadingOverlay } from "../Loading/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, SlidersHorizontal, ChevronDown, X, Star, Briefcase, Zap } from "lucide-react";
import { toast } from "react-toastify";

export const CounselorList = () => {
  const navigate = useNavigate();
  const { fetchData, apiLoading, isLoggedIn } = useAuth();
  const [counselors, setCounselors] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    experience: "",
    price: "",
    search: ""
  });

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const responseData = await fetchData(`${process.env.BACKEND_URL}/api/counselors`);
        if (responseData.success) {
          setCounselors(responseData.data || []);
        } else {
          toast.error(responseData.message);
        }
      } catch (error) {
        toast.error("An unexpected error occurred while fetching counselors");
      }
    };
    fetchingData();
  }, [fetchData, isLoggedIn]);

  const handlCounselorProfile = (e, counselorId) => {
    e.preventDefault();
    navigate(`/counselor-profile/${counselorId}`);
  };

  const filteredCounselors = counselors.filter((counselor) => {
    if (counselor.status === "disabled") return false;

    // Search Filter
    if (filters.search && !counselor.personalInfo?.name?.toLowerCase().includes(filters.search.toLowerCase())) return false;

    // Category Filter
    if (filters.category && counselor.counseling?.category !== filters.category) return false;

    // Experience Filter
    if (filters.experience) {
      const exp = parseInt(counselor.counselor?.education?.experience) || 0;
      if (filters.experience === "1" && exp < 1) return false;
      if (filters.experience === "2" && exp < 2) return false;
      if (filters.experience === "5" && exp < 5) return false;
      if (filters.experience === "10" && exp < 10) return false;
    }

    // Price Filter
    if (filters.price && (counselor.counseling?.price || 0) > parseInt(filters.price)) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-surface-soft dark:bg-primary-dark pt-28 pb-20 px-6">
      <div className="container mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black text-primary dark:text-white tracking-tight mb-2"
            >
              Elite <span className="text-accent underline decoration-secondary/30 underline-offset-8">Counselors</span>
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              Showing {filteredCounselors.length} world-class mentors ready to guide you.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Search by name..."
                className="pl-12 pr-6 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium min-w-[300px]"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-primary dark:text-white"
            >
              <SlidersHorizontal />
            </button>
          </div>
        </div>

        <div className="flex gap-10 relative">
          {/* Sidebar Filter - Desktop & Mobile */}
          <AnimatePresence>
            {(isFilterOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`
                  fixed inset-0 z-[110] bg-white dark:bg-primary-dark lg:relative lg:inset-auto lg:z-0 lg:bg-transparent
                  w-full lg:w-80 shrink-0 h-screen lg:h-auto overflow-y-auto lg:overflow-visible p-8 lg:p-0
                  ${isFilterOpen ? "block" : "hidden lg:block"}
                `}
              >
                <div className="lg:sticky lg:top-32 space-y-8">
                  <div className="flex items-center justify-between mb-8 lg:hidden">
                    <h2 className="text-2xl font-black text-primary dark:text-white">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl">
                      <X />
                    </button>
                  </div>

                  {/* Filter Groups */}
                  <div className="space-y-6">
                    {/* Category */}
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-primary-light/5 border border-gray-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 text-accent">
                        <Zap className="w-5 h-5" />
                        <h3 className="font-black uppercase tracking-widest text-xs">Specialization</h3>
                      </div>
                      <select
                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-accent/20 outline-none"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      >
                        <option value="">All Categories</option>
                        <option value="mental_health">Mental Health</option>
                        <option value="career_counseling">Career Counseling</option>
                        <option value="scholarship_counseling">Scholarship Counseling</option>
                      </select>
                    </div>

                    {/* Experience */}
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-primary-light/5 border border-gray-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 text-secondary">
                        <Briefcase className="w-5 h-5" />
                        <h3 className="font-black uppercase tracking-widest text-xs">Experience Level</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: "", label: "Any" },
                          { val: "1", label: "1+ Years" },
                          { val: "2", label: "2+ Years" },
                          { val: "5", label: "5+ Years" },
                          { val: "10", label: "10+ Years" }
                        ].map((opt) => (
                          <button
                            key={opt.val}
                            onClick={() => setFilters({ ...filters, experience: opt.val })}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${filters.experience === opt.val
                                ? "bg-secondary text-primary-dark border-secondary shadow-lg shadow-secondary/20"
                                : "bg-transparent border-gray-100 dark:border-white/5 text-gray-500 hover:border-secondary"
                              }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="p-6 rounded-[2rem] bg-white dark:bg-primary-light/5 border border-gray-100 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 text-emerald-500">
                        <Star className="w-5 h-5" />
                        <h3 className="font-black uppercase tracking-widest text-xs">Price Range</h3>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        className="w-full accent-emerald-500 mb-2"
                        value={filters.price || 500}
                        onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                      />
                      <div className="flex justify-between text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        <span>$0</span>
                        <span className="text-emerald-500">Up to ${filters.price || 500}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setFilters({ category: "", experience: "", price: "", search: "" })}
                      className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-accent transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Listings Grid */}
          <main className="flex-1">
            <AnimatePresence mode="popLayout">
              {filteredCounselors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredCounselors.map((counselor) => (
                    <CounselorCard
                      key={counselor._id}
                      handlCounselorProfile={handlCounselorProfile}
                      counselorData={counselor}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-white/5 rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100 dark:border-white/5"
                >
                  <div className="w-24 h-24 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Filter className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-black text-primary dark:text-white mb-4">No Counselors Found</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
                    We couldn't find any counselors matching your current filters. Try adjusting your search or resetting the filters.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
