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
        const res = await fetch("/api/offers", { cache: "no-store" });

        if (res.ok) {
          const data = await res.json();
          setOffers(data.offers);
        } else {
          setOffers([
            {
              id: 1,
              title: "Free Surprise Gift on Your First Purchase 🎁",
              description:
                "Shop now and get an exclusive free surprise gift with your very first LuxeLoom purchase. Don't miss out!",
              discount: "Free Gift",
              image: "/surprisegift.png",
              link: "/Shop",
            },
            {
              id: 2,
              title: "Festive Luxe Offer",
              description: "Celebrate style! Flat 30% OFF on premium outfits.",
              discount: "30% OFF",
              image: "/sale.png",
              link: "/Shop",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <Image
          src="/loading.gif"
          alt="Loading"
          width={60}
          height={60}
          className="mb-4"
        />
        <p className="text-lg font-medium text-white">Loading Offers...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-black px-4 py-10 md:px-12 lg:px-20">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 tracking-wide">
          LuxeLoom Exclusive Offers ✨
        </h1>

        {offers.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">
            No offers available right now. Please check back later.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-[#111] rounded-2xl overflow-hidden transition-transform duration-300 shadow-lg hover:shadow-yellow-500/40 ${
                  offer.id === 1
                    ? "border-2 border-yellow-400 hover:scale-105"
                    : "border border-gray-700 hover:scale-105"
                }`}
              >
                {/* Offer Image */}
                <div className="relative w-full h-60">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Offer Content */}
                <div className="p-5">
                  {/* Discount Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                      offer.id === 1
                        ? "bg-yellow-400 text-black"
                        : "bg-black border border-yellow-400 text-yellow-400"
                    }`}
                  >
                    {offer.discount}
                  </span>

                  {/* Offer Title */}
                  <h2
                    className={`text-xl font-semibold mt-3 ${
                      offer.id === 1 ? "text-yellow-400" : "text-white"
                    }`}
                  >
                    {offer.title}
                  </h2>

                  {/* Offer Description */}
                  <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Shop Now Button */}
                  <Link
                    href={offer.link}
                    className={`inline-block mt-4 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                      offer.id === 1
                        ? "bg-yellow-400 text-black hover:bg-yellow-500"
                        : "bg-black text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black"
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
