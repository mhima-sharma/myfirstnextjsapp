import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import Carousel from "./Carousel/page";
import HeroSection from "./hero/page";
import NavBar from "./navbar/page";
import ProjectOverview from "./ProjectOverview/page";
import Footer from "./footer/page";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed NavBar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md">
        <NavBar  />
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-[32px] items-center sm:items-start mt-[80px] px-4 w-full ">
        <HeroSection />
      </main>
      <main className="flex flex-col gap-[32px] items-center sm:items-start mt-[80px] px-4 w-full ">
        <ProjectOverview />
      </main>
      <main className="flex flex-col gap-[32px] items-center sm:items-start mt-[80px] px-4 w-full ">
        <Carousel />
      </main>
      
      {/* Footer */}
      <main className="flex flex-col gap-[32px] items-center sm:items-start mt-[80px] px-4 w-full ">
        <Footer/>
      </main>
    
    </div>
  );
}
