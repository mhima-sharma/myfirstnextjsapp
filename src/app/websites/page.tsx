"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Home, List } from "lucide-react";

const projects = [
  { name: "Little Leafy", url: "https://plant-website-frontend-beryl.vercel.app/" },
  { name: "Weather App", url: "https://mhima-sharma.github.io/Weather-App/" },
  { name: "Tic Tac Toe", url: "https://mhima-sharma.github.io/-tick-tack-/" },
  { name: "Random Math Problem", url: "https://mhima-sharma.github.io/random-math-problem/" },
];

export default function WebsitesPage() {
  const router = useRouter();
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("Location not set");

  const handleSelect = (url: string) => {
    setPreviousUrl(selectedUrl || null);
    setSelectedUrl(url);
  };

  const handleBack = () => {
    if (previousUrl) {
      setSelectedUrl(previousUrl);
      setPreviousUrl(null);
    }
  };

  const handleBackToList = () => {
    setPreviousUrl(null);
    setSelectedUrl(null);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`);
      },
      () => {
        alert("Unable to retrieve your location. Please allow location access.");
      }
    );
  };

  // Go back to Luxe Loom page
  const handleBackToLuxeLoom = () => {
    router.back(); // Takes you to the last visited page
    // Or, if Luxe Loom has a fixed path:
    // router.push("/luxeloom");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl border-r p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2 mb-4">
          <Home className="text-green-500" size={24} />
          <h2 className="text-2xl font-extrabold text-gray-800">My Projects</h2>
        </div>

        {/* Project Buttons */}
        {projects.map((project, index) => (
          <button
            key={index}
            onClick={() => handleSelect(project.url)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl text-lg font-medium transition-all duration-300 shadow-sm
              ${
                selectedUrl === project.url
                  ? "bg-green-500 text-white shadow-md scale-[1.02]"
                  : "bg-gray-100 text-gray-700 hover:text-green-600 hover:bg-gray-200 hover:scale-[1.02]"
              }`}
          >
            {project.name}
          </button>
        ))}

        {/* Get Location Button */}
        <button
          onClick={handleGetLocation}
          className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl shadow-md transition duration-300"
        >
          <MapPin size={20} />
          Get My Location
        </button>

        {/* Show Location */}
        <p className="mt-2 text-gray-600 text-sm">{location}</p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white flex flex-col">
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-green-600 shadow-md">
          <h1 className="text-xl font-bold text-white">
            {selectedUrl ? "Website Preview" : "Project Overview"}
          </h1>

          <div className="flex items-center gap-3">
            {/* Back to Luxe Loom */}
            <button
              onClick={handleBackToLuxeLoom}
              className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100 transition"
            >
              <ArrowLeft size={18} />
              Back to Luxe Loom
            </button>

            {selectedUrl && (
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100 transition"
              >
                <List size={18} />
                Project List
              </button>
            )}

            {previousUrl && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100 transition"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
          </div>
        </div>

        {/* Iframe Section */}
        {selectedUrl ? (
          <iframe
            src={selectedUrl}
            title="Website Preview"
            className="w-full flex-1 border-0"
            allow="geolocation; microphone; camera; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          ></iframe>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-600">
            <h2 className="text-2xl font-semibold">Select a Project to Preview</h2>
            <p className="mt-2 text-gray-500">
              Click on a project from the left sidebar to open it here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
