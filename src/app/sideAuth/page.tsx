"use client";

import { useState, useEffect } from "react";
import LoginPage from "../login/page";
import SignupPage from "../signup/page";

type SideAuthProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SideAuth({ isOpen, onClose }: SideAuthProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPanel, setShowPanel] = useState(false);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) setShowPanel(true);
    else {
      const timer = setTimeout(() => setShowPanel(false), 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!showPanel) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/75 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[360px] bg-white dark:bg-gray-900 shadow-xl flex flex-col overflow-hidden rounded-l-3xl
          transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {activeTab === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-white text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 p-3 text-center font-medium transition-colors ${
              activeTab === "signin"
                ? "bg-[#B39452] text-white "
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 p-3 text-center font-medium transition-colors ${
              activeTab === "signup"
                ? "bg-[#B39452] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
          {activeTab === "signin" ? <LoginPage /> : <SignupPage />}
        </div>
      </div>
    </>
  );
}
