"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PWARegister() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    };

    registerServiceWorker();
  }, []);

  useEffect(() => {
    const dismissed = window.localStorage.getItem("luxeloom-install-dismissed");

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      if (dismissed === "true") return;

      setInstallEvent(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setInstallEvent(null);
      setIsVisible(false);
      window.localStorage.removeItem("luxeloom-install-dismissed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    const choice = await installEvent.userChoice;

    if (choice.outcome === "accepted") {
      setIsVisible(false);
      setInstallEvent(null);
      window.localStorage.removeItem("luxeloom-install-dismissed");
      return;
    }

    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    window.localStorage.setItem("luxeloom-install-dismissed", "true");
  };

  const isHomePage = pathname === "/";

  if (!isHomePage || !isVisible || !installEvent) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl border border-[#d7c39a] bg-white/95 p-5 shadow-2xl backdrop-blur">
      <div className="flex items-start gap-4">
        <img
          src="/logo.png"
          alt="LuxeLoom"
          className="h-14 w-14 rounded-2xl border border-[#eadfca] object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9d8147]">
            Install LuxeLoom
          </p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">
            Add LuxeLoom to your device
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Get a faster, app-like shopping experience with quick access from your home screen.
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={handleDismiss}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Maybe later
        </button>
        <button
          type="button"
          onClick={handleInstall}
          className="flex-1 rounded-full bg-[#B39452] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9d8147]"
        >
          Install App
        </button>
      </div>
    </div>
  );
}
