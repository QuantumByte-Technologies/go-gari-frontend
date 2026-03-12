"use client";

import Link from "next/link";

const sections = [
  {
    id: 1,
    title: "Information We Collect",
    items: [
      {
        label: "Personal Information",
        text: "When you create an account or make a booking, we collect your name, email address, phone number, date of birth, and driving licence details.",
      },
      {
        label: "Booking Data",
        text: "We collect information about your rental bookings including pickup/drop-off locations, dates, vehicle preferences, and booking history.",
      },
      {
        label: "Payment Information",
        text: "Payment transactions are processed through SSLCommerz. We do not store your full credit/debit card details on our servers. SSLCommerz handles payment data in accordance with PCI-DSS standards.",
      },
      {
        label: "Device & Usage Data",
        text: "We automatically collect information such as your IP address, browser type, device information, and how you interact with our platform.",
      },
    ],
  },
  {
    id: 2,
    title: "How We Use Information",
    items: [
      {
        text: "Processing and managing your car rental bookings.",
      },
      {
        text: "Communicating booking confirmations, reminders, and updates.",
      },
      {
        text: "Verifying your identity and driving eligibility.",
      },
      {
        text: "Improving our platform, services, and customer experience.",
      },
      {
        text: "Sending promotional offers and updates (with your consent).",
      },
      {
        text: "Complying with legal obligations and resolving disputes.",
      },
    ],
  },
  {
    id: 3,
    title: "Data Sharing",
    paragraphs: [
      "GO GAARI does not sell your personal data to third parties. We share your information only in the following limited circumstances:",
      "Payment Processor: Transaction details are shared with SSLCommerz solely for payment processing purposes.",
      "Vehicle Providers: Necessary booking details are shared with vehicle owners/operators to fulfil your rental.",
      "Law Enforcement: We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect the rights, safety, or property of GO GAARI, our users, or the public.",
    ],
  },
  {
    id: 4,
    title: "Data Security",
    paragraphs: [
      "We implement industry-standard security measures to protect your personal data, including encryption of data in transit (SSL/TLS), secure server infrastructure, and access controls. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    id: 5,
    title: "Cookies",
    paragraphs: [
      "GO GAARI uses cookies and similar technologies to enhance your browsing experience, analyse platform usage, and personalise content. You can manage cookie preferences through your browser settings. Disabling cookies may affect certain features of the platform.",
    ],
  },
  {
    id: 6,
    title: "Your Rights",
    items: [
      { text: "Access the personal data we hold about you." },
      { text: "Request correction of inaccurate or incomplete data." },
      { text: "Request deletion of your account and associated data." },
      { text: "Withdraw consent for marketing communications at any time." },
      { text: "Request a copy of your data in a portable format." },
    ],
    footer:
      "To exercise any of these rights, please contact us through our support page.",
  },
  {
    id: 7,
    title: "Contact Information",
    paragraphs: [
      "If you have questions or concerns about this Privacy Policy or how your data is handled, please reach out to us:",
    ],
    contact: true,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Last updated: 1 March 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-gray-700 leading-relaxed mb-8">
          At GO GAARI, we are committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, and safeguard your personal
          information when you use our car rental platform. By using our
          services, you consent to the practices described in this policy.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#65AA36" }}
                >
                  {section.id}
                </span>
                {section.title}
              </h2>

              <div className="pl-10">
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-gray-600 leading-relaxed">
                        {"label" in item && item.label ? (
                          <span className="font-medium text-gray-800">
                            {item.label}:{" "}
                          </span>
                        ) : (
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 relative -top-px"
                            style={{ backgroundColor: "#65AA36" }}
                          />
                        )}
                        {item.text}
                      </li>
                    ))}
                    {section.footer && (
                      <p className="text-gray-600 mt-4 pt-3 border-t border-gray-100">
                        {section.footer}
                      </p>
                    )}
                  </ul>
                )}

                {section.paragraphs && (
                  <div className="space-y-3">
                    {section.paragraphs.map((para, idx) => (
                      <p key={idx} className="text-gray-600 leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {section.contact && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span>{" "}
                      support@gogari.com
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      +880-1700-000000
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span> Dhaka,
                      Bangladesh
                    </p>
                    <Link
                      href="/support"
                      className="inline-block mt-2 text-sm font-medium underline hover:no-underline"
                      style={{ color: "#65AA36" }}
                    >
                      Visit our Support page
                    </Link>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            Also see our{" "}
            <Link
              href="/terms"
              className="font-medium underline hover:no-underline"
              style={{ color: "#65AA36" }}
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/cancellation"
              className="font-medium underline hover:no-underline"
              style={{ color: "#65AA36" }}
            >
              Cancellation Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
