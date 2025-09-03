"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TermsAndConditions() {
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
          Terms & Conditions
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Please read these terms and conditions carefully before using our website.
        </p>

        {/* Content Box */}
        <div className="bg-white shadow-2xl rounded-3xl p-10 md:p-12 leading-relaxed text-gray-700 space-y-8">
          {/* Sections */}
          {[
            {
              title: "1. Introduction",
              content: (
                <>
                  Welcome to <span className="font-semibold">Luxeloom</span>. By accessing or using our
                  platform, you agree to comply with these Terms & Conditions. If you do not agree, please refrain from using our services.
                </>
              ),
            },
            {
              title: "2. Eligibility",
              content: (
                <>
                  You must be at least <span className="font-semibold">18 years</span> old to use our website. By using Luxeloom, you represent and warrant that you meet this requirement.
                </>
              ),
            },
            {
              title: "3. User Responsibilities",
              content: "You agree to provide accurate information and use Luxeloom’s services only for lawful purposes. Misuse of our platform, including fraudulent activities, is strictly prohibited.",
            },
            {
              title: "4. Privacy Policy",
              content: (
                <>
                  We respect your privacy. Please read our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#b4945f] underline hover:text-[#a07f50] transition"
                  >
                    Privacy Policy
                  </Link>{" "}
                  to understand how we collect, use, and safeguard your data.
                </>
              ),
            },
            {
              title: "5. Intellectual Property",
              content: "All content, including logos, images, and designs, are owned by Luxeloom and protected under intellectual property laws. Unauthorized use is prohibited.",
            },
            {
              title: "6. Limitation of Liability",
              content: "Luxeloom is not responsible for any direct, indirect, or consequential damages arising from the use of our website or services.",
            },
            {
              title: "7. Changes to Terms",
              content: "We may update these Terms & Conditions at any time. Changes will be posted on this page with the latest revision date.",
            },
            {
              title: "8. Contact Us",
              content: (
                <>
                  If you have any questions about these Terms, feel free to contact us at{" "}
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
