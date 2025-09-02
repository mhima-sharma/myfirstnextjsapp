"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../navbar/page";
import Footer from "../footer/page";

type Offer = {
  id: number;
  title: string;
  description: string;
  discount: string;
  image: string;
  link: string;
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        // Attempt to fetch offers from the API endpoint
        const res = await fetch("/api/offers");

        if (res.ok) {
          // If the response is OK, parse it as JSON
          const data = await res.json();
          // Update the offers state with the fetched offers
          setOffers(data.offers);
        } else {
          // If the API fails, use static fallback offers
          setOffers([
            {
              id: 1,
              title: "Free Surprise Gift on Your First Purchase 🎁",
              description:
                "Shop now and get an exclusive free surprise gift with your very first LuxeLoom purchase. Don't miss out!",
              discount: "Free Gift",
              image: "/surprisegift.png",
              link: "/shop",
            },
            {
              id: 2,
              title: "Festive Luxe Offer",
              description: "Celebrate style! Flat 30% OFF on premium outfits.",
              discount: "30% OFF",
              image: "/sale.png",
              link: "/shop",
            },
          ]);
        }
      } catch (error) {
        // Handle any network or unexpected errors
        console.error("Error fetching offers:", error);
      } finally {
        // Once fetching is done (success or failure), set loading to false
        setLoading(false);
      }
    }

    // Call the function to fetch offers when the component mounts
    fetchOffers();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-medium text-gray-700">
        Loading Offers...
      </div>
    );
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-12 lg:px-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          LuxeLoom Exclusive Offers ✨
        </h1>

        {offers.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No offers available right now. Please check back later.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-white shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 ${
                  offer.id === 1
                    ? "border-4 border-yellow-400 hover:scale-110"
                    : "hover:scale-105"
                }`}
              >
                <div className="relative w-full h-60">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      offer.id === 1
                        ? "bg-yellow-400 text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {offer.discount}
                  </span>
                  <h2
                    className={`text-xl font-semibold mt-3 ${
                      offer.id === 1 ? "text-yellow-600" : "text-gray-800"
                    }`}
                  >
                    {offer.title}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    {offer.description}
                  </p>
                  <Link
                    href={offer.link}
                    className={`inline-block mt-4 px-5 py-2 rounded-lg text-sm font-medium transition ${
                      offer.id === 1
                        ? "bg-yellow-500 text-black hover:bg-yellow-600"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
