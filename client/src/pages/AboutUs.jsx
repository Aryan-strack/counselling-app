import { motion } from "framer-motion";
import {
  Users,
  Target,
  Heart,
  Award,
  Lightbulb,
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const GlassCard = ({ children, className = "" }) => (
  <div className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 group ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ subtitle, title, description }) => (
  <div className="max-w-4xl mx-auto text-center mb-20 px-6">
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-6"
    >
      <Sparkles className="w-4 h-4" />
      <span>{subtitle}</span>
    </motion.span>
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-6xl font-black text-primary dark:text-white mb-8 tracking-tight"
    >
      {title}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed"
    >
      {description}
    </motion.p>
  </div>
);

export const AboutUs = () => {
  const features = [
    {
      icon: Target,
      title: "Visionary Mission",
      description: "Empowering 100M+ students globally by 2030 through AI-enhanced human guidance.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Heart,
      title: "Human First",
      description: "While we use AI, we believe the human connection is the core of effective counseling.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    {
      icon: Award,
      title: "Elite Standards",
      description: "Only top 5% of counseling applicants are selected for our elite mentorship platform.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Lightbulb,
      title: "Meta-Learning",
      description: "We don't just solve problems; we teach students the art of decision making.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Shield,
      title: "Iron Privacy",
      description: "Your data is encrypted with military-grade protocols and never sold to third parties.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access world-class career insights from experts across 50+ countries.",
      color: "text-sky-500",
      bgColor: "bg-sky-500/10"
    },
  ];

  return (
    <div className="min-h-screen bg-surface-soft dark:bg-primary-dark pt-24 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <main className="container mx-auto px-6">
        {/* --- Hero Section --- */}
        <section className="py-24 flex flex-col items-center">
          <SectionHeader
            subtitle="The Story Behind"
            title="We're Redefining the Counseling Experience"
            description="StudentCounselor was born from a simple realization: the brightest minds often need the clearest guidance to reach their ultimate destination."
          />

          <div className="relative w-full max-w-5xl rounded-[3rem] overflow-hidden aspect-video shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover"
              alt="Team working"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-12">
              <div className="flex flex-col md:flex-row gap-12 w-full">
                {[
                  { label: "Founded", val: "2024" },
                  { label: "Community", val: "50k+" },
                  { label: "Countries", val: "40+" }
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-secondary font-black text-4xl mb-1">{s.val}</p>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- Core Philosophy --- */}
        <section className="py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="dark:bg-primary-light/10 border-gray-100">
                  <div className={`w-14 h-14 rounded-2xl ${f.bgColor} flex items-center justify-center mb-8`}>
                    <f.icon className={`w-7 h-7 ${f.color}`} />
                  </div>
                  <h3 className="text-2xl font-black text-primary dark:text-white mb-4 group-hover:text-accent transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {f.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- How We Work Section --- */}
        <section className="py-32 bg-white dark:bg-primary-light/5 rounded-[4rem] px-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <SectionHeader
            subtitle="Our Process"
            title="Engineered for Your Growth"
            description="A seamless, high-performance workflow designed to get you results faster."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {[
              {
                step: "01",
                title: "Curated Matching",
                desc: "Our engine analyzes your profile and matches you with a mentor who has been exactly where you want to go."
              },
              {
                step: "02",
                title: "Dynamic Roadmap",
                desc: "Collaborate with your counselor to build a living roadmap that adapts to your evolving career interests."
              },
              {
                step: "03",
                title: "Accelerated Results",
                desc: "Get direct introductions to industry networks and universities through our platform's ecosystem."
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <span className="text-9xl font-black text-primary/5 dark:text-white/5 absolute -top-10 -left-6 group-hover:text-accent/10 transition-colors">
                  {item.step}
                </span>
                <div className="relative z-10 pt-10">
                  <h4 className="text-2xl font-black text-primary dark:text-white mb-4 group-hover:translate-x-3 transition-transform">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="rounded-[3rem] bg-gradient-to-br from-primary to-accent p-12 md:p-24 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
                Be Part of Our <br /> <span className="text-secondary">Next Success</span> Story
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium">
                Whether you're a student seeking path or a counselor wanting to change lives,
                there's a place for you in our growing community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/register"
                  className="px-12 py-5 rounded-2xl bg-secondary text-primary font-black text-xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-secondary/30"
                >
                  Join the Community
                </Link>
                <Link to="/contact" className="text-white font-bold text-lg hover:underline opacity-80">
                  Contact Support
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

