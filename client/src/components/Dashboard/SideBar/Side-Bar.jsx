import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/Context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Book, Users, UserPlus,
  LogOut, PlusCircle, LayoutDashboard,
  ChevronRight, X, Sparkles, UserCircle
} from "lucide-react";
import { toast } from "react-toastify";

export const SideBar = ({ isSidebarOpen, toggleSidebar, onSelectChat }) => {
  const { fetchData, isLoggedIn, LogoutUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [activeChatId, setActiveChatId] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const responseData = await fetchData(`${process.env.BACKEND_URL}/api/user/friends`);
        if (responseData.success) {
          setUserData(responseData.data || {});
        }
      } catch (error) {
        toast.error("Failed to load contacts");
      }
    };
    fetchingData();
  }, [fetchData, isLoggedIn]);

  const useClickHandler = (friend) => {
    onSelectChat(friend, userData?._id);
    setActiveChatId(friend._id);
  };

  const NavLink = ({ to, icon: Icon, label, active }) => (
    <Link to={to}>
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${active
            ? "bg-secondary text-primary-dark shadow-lg shadow-secondary/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
      >
        <Icon size={20} className={active ? "text-primary-dark" : "text-secondary"} />
        <span className="text-sm font-black uppercase tracking-widest">{label}</span>
      </motion.div>
    </Link>
  );

  return (
    <div className="h-full flex flex-col p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-4 mb-12 px-2 relative z-10">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-accent/20">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-white text-xl font-black tracking-tighter leading-none">SC <span className="text-secondary">AI</span></h2>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Premium Portal</span>
        </div>
        <button onClick={toggleSidebar} className="md:hidden ml-auto p-2 bg-white/5 rounded-xl text-gray-400">
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="space-y-2 mb-12 relative z-10">
        <NavLink to="/" icon={Home} label="Home" active={location.pathname === "/"} />
        <NavLink to="/dashboard" icon={LayoutDashboard} label="Overview" active={location.pathname === "/dashboard"} />

        {userData?.role === "admin" && (
          <>
            <NavLink to="/dashboard/admin-counselor" icon={Users} label="Counselors" active={location.pathname.includes("admin-counselor")} />
            <NavLink to="/dashboard/admin-student" icon={Users} label="Students" active={location.pathname.includes("admin-student")} />
            <NavLink to="/dashboard/upload-book" icon={PlusCircle} label="Upload Book" active={location.pathname.includes("upload-book")} />
          </>
        )}

        {userData?.role === "student" && (
          <NavLink to="/dashboard/book-library" icon={Book} label="Library" active={location.pathname.includes("book-library")} />
        )}

        {userData?.role === "counselor" && (
          <NavLink to="/dashboard/create-session" icon={PlusCircle} label="Schedules" active={location.pathname.includes("create-session")} />
        )}
      </div>

      {/* Contact List / Chat History */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-10">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="h-[2px] w-4 bg-secondary rounded-full" />
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap">
            {userData?.role === "counselor" ? "My Students" : "My Mentors"}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {userData?.friends?.length > 0 ? (
            userData.friends.map((friend) => (
              <motion.button
                key={friend._id}
                whileHover={{ x: 5 }}
                onClick={() => useClickHandler(friend)}
                className={`w-full group flex items-center gap-4 p-3 rounded-2xl transition-all ${activeChatId === friend._id
                    ? "bg-white/10 border border-white/10 lg:shadow-xl"
                    : "hover:bg-white/5 border border-transparent"
                  }`}
              >
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform"
                    src={`${process.env.BACKEND_URL}/images/${friend?.profile}`}
                    onError={(e) => { e.target.src = "/default-avatar.png" }}
                    alt={friend.personalInfo?.name}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-primary rounded-full" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-black text-gray-200 truncate group-hover:text-white transition-colors">
                    {friend.personalInfo?.name}
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold truncate">Online Now</p>
                </div>
              </motion.button>
            ))
          ) : (
            <div className="text-center py-10 px-4 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <UserCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Direct access limited</p>
            </div>
          )}
        </div>
      </div>

      {/* Logout Footer */}
      <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
        <button
          onClick={() => { LogoutUser(); navigate("/"); }}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-widest">End Session</span>
        </button>
      </div>
    </div>
  );
};
