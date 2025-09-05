import { FaWhatsapp } from "react-icons/fa";
import HeroSection from "./hero/page";
import ProjectOverview from "./ProjectOverview/page";
import Carousel from "./Carousel/page";
import Footer from "./footer/page";
import NavBar from "./navbar/page";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Fixed NavBar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md">
        <NavBar />
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-[80px] mt-[80px] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 w-full max-w-[1600px] mx-auto">
        {/* Hero Section */}
        <section className="w-full">
          <HeroSection />
        </section>

        {/* Project Overview */}
        <section className="w-full">
          <ProjectOverview />
        </section>

        {/* Carousel */}
        <section className="w-full">
          <Carousel />
        </section>

        {/* Footer */}
        <section className="w-full mt-10">
          <Footer />
        </section>
      </main>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/917988543400?text=Welcome to LuxeLoom"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-green-500 text-white p-4 sm:p-5 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
}
