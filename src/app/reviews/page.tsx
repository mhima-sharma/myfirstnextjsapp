"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  created_at: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Mahima Sharma",
      rating: 5,
      comment: "Amazing quality! Absolutely loved my purchase. Will shop again 😍",
      imageUrl: "/logo.png",
      created_at: "2025-08-01",
    },
    {
      id: 2,
      name: "Rohan Mehta",
      rating: 4,
      comment: "The fabric feels premium. Delivery was super fast too!",
      imageUrl: "/logo2.png",
      created_at: "2025-08-10",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    rating: 0,
    comment: "",
    image: null as File | null,
    imagePreview: "",
  });

  const [showForm, setShowForm] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle image selection & preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  // Handle review submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: reviews.length + 1,
      name: form.name,
      rating: form.rating,
      comment: form.comment,
      imageUrl: form.imagePreview,
      created_at: new Date().toISOString(),
    };
    setReviews([newReview, ...reviews]);
    setForm({ name: "", rating: 0, comment: "", image: null, imagePreview: "" });
    setShowForm(false);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-5xl mx-auto py-10 px-4">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#d4af37] to-[#b8860b] bg-clip-text text-transparent">
            Customer Reviews
          </h1>
          <p className="text-gray-300 mt-3 text-lg">
            Discover what our LuxeLoom customers are saying about their premium purchases.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              {showForm ? "Close Review Form" : "Give a Review"}
            </button>

            <Link
              href="/"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Review Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 shadow-2xl rounded-2xl p-6 mb-10 border border-gray-700 transition-all duration-500"
          >
            <h2 className="text-2xl font-semibold mb-5 text-white">Share Your Experience</h2>

            {/* Name Input */}
            <div className="mb-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Rating Input */}
            <div className="mb-5 flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={32}
                  onClick={() => setForm({ ...form, rating: star })}
                  className={`cursor-pointer transition-transform duration-200 ${
                    star <= form.rating ? "text-[#d4af37] scale-110" : "text-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Comment Input */}
            <div className="mb-5">
              <textarea
                name="comment"
                placeholder="Write your review..."
                value={form.comment}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] bg-gray-800 border-gray-700 text-white"
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-5">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-gray-300"
              />
              {form.imagePreview && (
                <div className="mt-3">
                  <Image
                    src={form.imagePreview}
                    alt="Preview"
                    width={120}
                    height={120}
                    className="rounded-lg border border-gray-600 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Review List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-900 shadow-lg p-4 rounded-xl border border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base text-white">{review.name}</h3>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={16}
                        className={`${star <= review.rating ? "text-[#d4af37]" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-2">{review.comment}</p>
                {review.imageUrl && (
                  <div className="mt-3">
                    <Image
                      src={review.imageUrl}
                      alt="review"
                      width={140}
                      height={140}
                      className="rounded-lg border border-gray-700 shadow-sm"
                    />
                  </div>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No reviews yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
