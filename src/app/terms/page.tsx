"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-gray-800">
      {/* Header Section */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl font-semibold cursor-pointer tracking-wide text-gray-900 hover:text-[#c5a880] transition-colors"
          >
            Luxeloom
          </h1>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#c5a880] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
          Terms & Conditions
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Please read these terms and conditions carefully before using our
          website.
        </p>

        {/* Content */}
        <div className="bg-white shadow-lg rounded-2xl p-8 md:p-10 leading-relaxed text-gray-700 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              1. Introduction
            </h3>
            <p>
              Welcome to <span className="font-semibold">Luxeloom</span>. By
              accessing or using our platform, you agree to comply with these
              Terms & Conditions. If you do not agree, please refrain from using
              our services.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              2. Eligibility
            </h3>
            <p>
              You must be at least <span className="font-semibold">18 years</span>{" "}
              old to use our website. By using Luxeloom, you represent and
              warrant that you meet this requirement.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              3. User Responsibilities
            </h3>
            <p>
              You agree to provide accurate information and use Luxeloom’s
              services only for lawful purposes. Misuse of our platform,
              including fraudulent activities, is strictly prohibited.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              4. Privacy Policy
            </h3>
            <p>
              We respect your privacy. Please read our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#c5a880] underline hover:text-[#b4945f] transition"
              >
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and safeguard your data.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              5. Intellectual Property
            </h3>
            <p>
              All content, including logos, images, and designs, are owned by
              Luxeloom and protected under intellectual property laws. Unauthorized
              use is prohibited.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              6. Limitation of Liability
            </h3>
            <p>
              Luxeloom is not responsible for any direct, indirect, or
              consequential damages arising from the use of our website or
              services.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              7. Changes to Terms
            </h3>
            <p>
              We may update these Terms & Conditions at any time. Changes will
              be posted on this page with the latest revision date.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              8. Contact Us
            </h3>
            <p>
              If you have any questions about these Terms, feel free to contact
              us at{" "}
              <a
                href="mailto:support@luxeloom.com"
                className="text-[#c5a880] underline hover:text-[#b4945f] transition"
              >
                support@luxeloom.com
              </a>
              .
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500 text-sm">
          © {new Date().getFullYear()} Luxeloom. All Rights Reserved.
        </div>
      </main>
    </div>
  );
}
