"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f4f2f0] text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-bold cursor-pointer tracking-wide text-gray-900 hover:text-[#b4945f] transition-colors"
          >
            Luxeloom
          </h1>
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-[#b4945f] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gray-900 tracking-tight">
          Privacy Policy
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Your privacy is important to us. This Privacy Policy explains how Luxeloom collects, uses, and protects your personal information.
        </p>

        {/* Content Box */}
        <div className="bg-white shadow-2xl rounded-3xl p-10 md:p-12 leading-relaxed text-gray-700 space-y-8">
          {[
            {
              title: "1. Information We Collect",
              content:
                "We may collect personal information such as your name, email address, phone number, and payment details when you use our website or services. We also automatically collect non-personal information such as browser type, IP address, and browsing behavior for analytics purposes.",
            },
            {
              title: "2. How We Use Your Information",
              content:
                "We use your information to provide and improve our services, process payments, communicate important updates, and personalize your experience. Non-personal data is used for analytics, research, and improving website functionality.",
            },
            {
              title: "3. Sharing of Information",
              content:
                "Luxeloom does not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website, conducting business, or servicing you, as long as they agree to keep it confidential.",
            },
            {
              title: "4. Cookies & Tracking",
              content:
                "We use cookies and similar tracking technologies to enhance user experience, analyze website traffic, and provide personalized content. You can manage your cookie preferences through your browser settings.",
            },
            {
              title: "5. Data Security",
              content:
                "We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.",
            },
            {
              title: "6. Your Rights",
              content:
                "You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional emails. To exercise these rights, please contact us at the email below.",
            },
            {
              title: "7. Changes to Privacy Policy",
              content:
                "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the latest revision date.",
            },
            {
              title: "8. Contact Us",
              content: (
                <>
                  If you have questions about this Privacy Policy or how your data is handled, contact us at{" "}
                  <a
                    href="mailto:mahimasharma052002@gmail.com"
                    className="text-[#b4945f] underline hover:text-[#a07f50] transition"
                  >
                    mahimasharma052002@gmail.com
                  </a>
                  .
                </>
              ),
            },
          ].map((section, idx) => (
            <section key={idx} className="space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">{section.title}</h3>
              <p className="text-gray-700">{section.content}</p>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-14 text-gray-500 text-sm">
          © {new Date().getFullYear()} Luxeloom. All Rights Reserved.
        </div>
      </main>
    </div>
  );
}
