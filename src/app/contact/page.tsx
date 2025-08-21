"use client";

import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import NavBar from "../navbar/page";
import Footer from "../footer/page";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setSuccess(data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md bg-white dark:bg-black">
        <NavBar />
      </header>

      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have questions, feedback, or business inquiries? We'd love to hear from you.
        </p>
      </section>

      {/* Contact Info & Form */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
          <div className="flex items-center space-x-4">
            <FaPhoneAlt className="text-gray-900 dark:text-gray-100 text-xl" />
            <span className="text-lg">+91 79885 43___</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-gray-900 dark:text-gray-100 text-xl" />
            <span className="text-lg">mahimasharma052002@gmail.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-gray-900 dark:text-gray-100 text-xl" />
            <span className="text-lg">LuxeLoom India</span>
          </div>

          {/* Google Maps */}
          <div className="mt-8">
            <iframe
              title="LuxeLoom Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609931706!2d72.74109962413493!3d19.08219783989148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63f5b6c43e1%3A0x3f84c5464b81b80c!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1692970320!5m2!1sen!2sin"
              width="100%"
              height="300"
              className="rounded-lg border-0"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 dark:bg-gray-700 dark:border-gray-600"
              required
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
          {success && <p className="mt-4 text-green-600 dark:text-green-400 font-medium">{success}</p>}
          {error && <p className="mt-4 text-red-600 dark:text-red-400 font-medium">{error}</p>}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
