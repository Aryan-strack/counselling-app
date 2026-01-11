import React, { useState } from "react";
import { SideBar } from "../components/Dashboard/SideBar/Side-Bar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Dashboard/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export const UserDashboard = () => {
  const [selectedChat, setSelectedChat] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectChat = (chatUser, userId) => {
    setSelectedChat({ chatUser, userId });
    // On mobile, close sidebar after selecting a chat
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-surface-soft dark:bg-primary-dark flex overflow-hidden">
      {/* Sidebar - Desktop & Mobile */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`
              fixed inset-y-0 left-0 z-[100] w-[280px] bg-primary dark:bg-primary-dark/80 backdrop-blur-3xl shadow-2xl
              md:static md:z-0 md:bg-transparent md:backdrop-blur-none md:shadow-none md:block
              ${isSidebarOpen ? "block" : "hidden"}
            `}
          >
            <SideBar
              onSelectChat={handleSelectChat}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <Outlet context={{ selectedChat }} />
          </div>
        </div>
      </main>
    </div>
  );
};
