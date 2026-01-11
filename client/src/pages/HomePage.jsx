import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
} from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layout,
} from "lucide-react";
import { useAuth } from "../context/Context";
import { toast } from "react-toastify";

// Modern UI Components
const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}>
    {children}
  </div>
);

const PremiumButton = ({ children, onClick, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-secondary text-primary-dark hover:bg-secondary-light shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    outline: "border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm",
    accent: "bg-accent text-white hover:bg-accent-light shadow-[0_0_20px_rgba(99,102,241,0.3)]"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-8 py-3 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const SectionHeading = ({ title, subtitle, centered = true }) => (
  <div className={`mb-16 ${centered ? "text-center" : ""}`}>
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block"
    >
      {subtitle}
    </motion.span>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-bold dark:text-white text-primary"
    >
      {title}
    </motion.h2>
  </div>
);

function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow font-delay-2000" />
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-primary-light/10 rounded-full blur-[80px]" />
    </div>
  );
}

function CounselorCard({ counselor }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-white dark:bg-primary-light/20 rounded-3xl border border-gray-100 dark:border-white/5 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        {/* Profile Image Wrapper */}
        <div className="relative h-64 w-full">
          <img
            src={`${process.env.BACKEND_URL}/images/${counselor.profile}`}
            alt={counselor.personalInfo.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => (e.target.src = "/fallback-image.png")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary text-primary-dark text-xs font-bold rounded-full mb-2">
                  {counselor.counselor.education.category || "Professional"}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {counselor.personalInfo.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
                <Star className="w-3 h-3 text-secondary fill-secondary" />
                <span className="text-white text-xs font-bold">4.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 text-accent" />
              <span>{counselor.counselor.education.experience} Experience</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4 text-secondary" />
              <span>{counselor.friends.length}+ Clients</span>
            </div>
          </div>

          <p className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6 transition-all duration-300 ${isExpanded ? "" : "line-clamp-2"}`}>
            {counselor.counselor.education.description}
          </p>

          <PremiumButton
            variant="outline"
            className="w-full !py-2 !px-4 text-sm border-gray-200 dark:border-white/10 !text-primary dark:!text-white hover:!bg-accent hover:!text-white hover:!border-accent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "View Profile"}
            <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? "-rotate-90" : ""}`} />
          </PremiumButton>
        </div>
      </div>
    </motion.div>
  );
}

const FeatureIcon = ({ icon: Icon, color }) => (
  <div className={`p-4 rounded-2xl ${color} bg-opacity-10 mb-6 inline-block`}>
    <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
  </div>
);

export function HomePage() {
  const { fetchData, isLoggedIn } = useAuth();
  const [counselors, setCounselors] = useState([]);
  const { scrollYProgress } = useScroll();
  const scale = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const responseData = await fetchData(`${process.env.BACKEND_URL}/api/counselors`);
        if (responseData.success) {
          setCounselors(responseData.data || []);
        }
      } catch (error) {
        toast.error("Failed to fetch counselors");
      }
    };
    fetchingData();
  }, [fetchData, isLoggedIn]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface-soft dark:bg-primary-dark overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-secondary-dark z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
          <BackgroundElements />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-3/5 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-8"
                >
                  <Zap className="w-4 h-4" />
                  <span>The Future of Counseling is Here</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-8xl font-black text-primary dark:text-white leading-[1.1] mb-8"
                >
                  Unlock Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-secondary-dark animate-gradient-x">
                    True Potential
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed"
                >
                  Connect with world-class mentors and counselors who will guide you
                  towards a brighter future in education and career.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
                >
                  <PremiumButton variant="primary">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </PremiumButton>
                  <PremiumButton variant="outline" className="!text-primary dark:!text-white !border-primary/10 dark:!border-white/10">
                    Learn How it Works
                  </PremiumButton>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-16 flex items-center gap-8 justify-center lg:justify-start grayscale opacity-50 dark:invert"
                >
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Trusted By</span>
                  <div className="flex gap-8">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="h-6" alt="Google" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" className="h-6" alt="IBM" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" className="h-6" alt="Netflix" />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="lg:w-2/5 relative"
              >
                <div className="relative z-10 p-8">
                  <GlassCard className="p-2 overflow-hidden ring-1 ring-white/20">
                    <img
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
                      alt="Counseling Session"
                      className="rounded-xl shadow-inner"
                    />
                  </GlassCard>
                </div>
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 z-20"
                >
                  <GlassCard className="p-4 flex items-center gap-3">
                    <div className="bg-green-500 w-3 h-3 rounded-full animate-ping" />
                    <span className="text-sm font-bold text-white">124 Counselors Online</span>
                  </GlassCard>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- Stats Section --- */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Students", value: "50k+", icon: Users },
                { label: "Expert Advisors", value: "200+", icon: Star },
                { label: "Success Rate", value: "98%", icon: ShieldCheck },
                { label: "Sessions Held", value: "10k+", icon: CheckCircle2 },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-8 rounded-3xl bg-white dark:bg-primary-light/10 border border-gray-100 dark:border-white/5"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-accent" />
                  <div className="text-4xl font-black text-primary dark:text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-24 bg-surface-soft dark:bg-primary-dark/50">
          <div className="container mx-auto px-6">
            <SectionHeading
              subtitle="Why Choose Us"
              title="Experience Professional Counseling Like Never Before"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: "Smart Matching",
                  desc: "Our AI-powered algorithm connects you with the most suitable counselor based on your specific needs.",
                  icon: Zap,
                  color: "bg-blue-500"
                },
                {
                  title: "Real-time Sessions",
                  desc: "Experience zero latency video and chat sessions with our high-performance communication layer.",
                  icon: Layout,
                  color: "bg-purple-500"
                },
                {
                  title: "Guaranteed Security",
                  desc: "Your data and sessions are protected by enterprise-grade encryption and strict privacy protocols.",
                  icon: ShieldCheck,
                  color: "bg-emerald-500"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="p-10 rounded-[2.5rem] bg-white dark:bg-primary-light/10 border border-gray-100 dark:border-white/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  <FeatureIcon icon={feature.icon} color={feature.color} />
                  <h3 className="text-2xl font-bold dark:text-white mb-4 group-hover:text-accent transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Counselors Section --- */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-accent font-black tracking-widest uppercase text-xs mb-4 block"
                >
                  World Class Mentors
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-5xl font-black dark:text-white leading-tight"
                >
                  Meet Our <span className="text-secondary">Elite</span> Counselors
                </motion.h2>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/counselors" className="group flex items-center gap-3 text-lg font-bold dark:text-white">
                  Discover All Experts
                  <span className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {counselors?.slice(0, 3).map((counselor, index) => (
                <CounselorCard key={index} counselor={counselor} />
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-24 px-6">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative rounded-[3rem] bg-accent p-12 md:p-20 overflow-hidden text-center"
            >
              <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                  Ready to Transform <br /> Your Career Path?
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12">
                  Join thousands of successful students who found their passion
                  through our professional counseling services.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <PremiumButton className="!bg-white !text-accent hover:!bg-white/90 !px-12 !py-4 text-xl">
                    Get Started Now
                  </PremiumButton>
                  <Link to="/about" className="text-white font-bold hover:underline">
                    View Success Stories
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-secondary text-primary-dark rounded-full shadow-[0_10px_30px_rgba(245,158,11,0.5)] z-[90] flex items-center justify-center"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
