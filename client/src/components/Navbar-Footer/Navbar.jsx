import { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard, Search, Info, Home, UserCircle } from "lucide-react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Context";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, fetchData, LogoutUser, refreshFlag } = useAuth();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchingData = async () => {
        try {
          const responseData = await fetchData(`${process.env.BACKEND_URL}/api/user`);
          if (responseData.success) {
            setUserData(responseData.data || {});
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchingData();
    }
  }, [isLoggedIn, fetchData, refreshFlag]);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Counselors", path: "/counselorList", icon: Search },
    { name: "About", path: "/about", icon: Info },
  ];

  if (isLoggedIn && userData.role) {
    const canAccessDashboard =
      (userData.role === "student" && userData.friends?.length > 0) ||
      userData.role === "counselor" ||
      userData.role === "admin";

    if (canAccessDashboard) {
      navLinks.splice(1, 0, { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard });
    }
  }

  const location = useLocation();

  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleLogout = () => {
    LogoutUser();
    toast.success("Logged out successfully");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${isScrolled
        ? "py-3 bg-white/80 dark:bg-primary-dark/80 backdrop-blur-xl shadow-lg border-b border-white/20"
        : "py-6 bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className={`text-2xl font-black tracking-tight transition-colors duration-300 ${isScrolled || isOpen ? "text-primary dark:text-white" : "text-primary dark:text-white"
            }`}>
            Student<span className="text-secondary">Counselor</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => `
                  relative py-2 text-sm font-bold transition-all duration-300
                  ${isActive
                    ? "text-accent"
                    : "text-gray-500 hover:text-primary dark:hover:text-white"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-2" />

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to={userData.role === 'student' ? '/profile/student' : '/profile/counselor'}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 pr-4"
                >
                  <img
                    src={userData.profile ? `${process.env.BACKEND_URL}/images/${userData.profile}` : "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-accent object-cover"
                  />
                  <div className="hidden xl:block">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{userData.role}</p>
                    <p className="text-sm font-black dark:text-white">{userData.personalInfo?.name?.split(' ')[0]}</p>
                  </div>
                </motion.div>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-primary dark:hover:text-white transition-colors">
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-xl bg-secondary text-primary-dark font-black text-sm shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Book a Session
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-primary-dark border-b border-gray-100 dark:border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all
                    ${isActive ? "bg-accent/10 text-accent" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"}
                  `}
                >
                  <link.icon className="w-6 h-6" />
                  {link.name}
                </NavLink>
              ))}

              <div className="h-px bg-gray-100 dark:bg-white/5 my-2" />

              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={userData.profile ? `${process.env.BACKEND_URL}/images/${userData.profile}` : "/default-avatar.png"}
                      className="w-12 h-12 rounded-full border-2 border-accent"
                    />
                    <div>
                      <p className="text-sm font-black dark:text-white">{userData.personalInfo?.name}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{userData.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 text-red-500 font-bold"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-white/5 dark:text-white font-bold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl bg-secondary text-primary dark:text-primary-dark font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
