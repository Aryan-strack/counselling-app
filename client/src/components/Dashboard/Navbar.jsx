import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Context";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, X, Bell, Search, Settings, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
  const { isLoggedIn, fetchData } = useAuth();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const responseData = await fetchData(`${process.env.BACKEND_URL}/api/user`);
        if (responseData.success) {
          setUserData(responseData.data || {});
        }
      } catch (error) {
        toast.error("User data fetch failed");
      }
    };
    fetchingData();
  }, [isLoggedIn, fetchData]);

  const profileLink = userData?.role === "counselor" ? "/profile/counselor" : "/profile/student";

  return (
    <nav className="h-24 px-6 md:px-10 flex items-center justify-between bg-white/50 dark:bg-primary-dark/50 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 relative z-[80]">
      {/* Left: Search & Trigger */}
      <div className="flex items-center gap-6">
        <button
          className="md:hidden p-3 rounded-2xl bg-white dark:bg-white/5 text-primary dark:text-white"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="hidden lg:flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 w-96 group focus-within:ring-2 focus-within:ring-accent/20 transition-all">
          <Search size={18} className="text-gray-400 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="bg-transparent border-none outline-none text-sm font-medium text-primary dark:text-white w-full placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Center: Title (Mobile Only) */}
      <div className="md:hidden">
        <h1 className="text-lg font-black text-primary dark:text-white tracking-tight">Portal</h1>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-4">
          <button className="p-3 rounded-2xl text-gray-400 hover:text-accent hover:bg-accent/5 transition-all outline-none">
            <Bell size={20} />
          </button>
          <button className="p-3 rounded-2xl text-gray-400 hover:text-secondary hover:bg-secondary/5 transition-all outline-none">
            <Settings size={20} />
          </button>
        </div>

        <div className="h-10 w-px bg-gray-100 dark:bg-white/10 mx-2 hidden md:block" />

        <Link to={profileLink} className="group">
          <div className="flex items-center gap-4 p-1.5 md:p-2 rounded-3xl md:bg-white dark:md:bg-white/5 md:border md:border-gray-100 dark:md:border-white/10 md:shadow-sm hover:shadow-md transition-all">
            <div className="relative">
              <img
                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform"
                src={`${process.env.BACKEND_URL}/images/${userData?.profile}`}
                onError={(e) => { e.target.src = "/default-avatar.png" }}
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-primary-dark rounded-full" />
            </div>
            <div className="hidden md:block pr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-primary dark:text-white truncate max-w-[120px]">
                  {userData?.personalInfo?.name?.split(' ')[0]}
                </span>
                <Sparkles size={12} className="text-secondary" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{userData?.role}</p>
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
