import { FaWhatsapp } from "react-icons/fa";
import HeroSection from "./hero/page";
import ProjectOverview from "./ProjectOverview/page";
import Carousel from "./Carousel/page";
import Footer from "./footer/page";
import NavBar from "./navbar/page";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Fixed NavBar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md">
        <NavBar />
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-[80px] mt-[80px] px-4 w-full">
        <section className="w-full"><HeroSection /></section>
        <section className="w-full"><ProjectOverview /></section>
        <section className="w-full"><Carousel /></section>
        <section className="w-full"><Footer /></section>
      </main>

      {/* WhatsApp Floating Badge */}
      <a
        href="https://wa.me/917988543400?text=Welcome to LuxeLoom"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 transition-transform"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
}
