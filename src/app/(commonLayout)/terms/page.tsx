"use client";

import Link from "next/link";

const sections = [
  {
    id: 1,
    title: "Acceptance of Terms",
    content:
      "By accessing or using the GO GAARI platform (website and mobile applications), you agree to be bound by these Terms & Conditions. If you do not agree to all of these terms, you must not use our services. Your continued use of the platform constitutes acceptance of any updates or modifications to these terms.",
  },
  {
    id: 2,
    title: "Eligibility",
    content:
      "To use GO GAARI's car rental services, you must be at least 18 years of age and hold a valid driving licence recognised in Bangladesh. For self-drive rentals, you must present your original driving licence at the time of vehicle pickup. GO GAARI reserves the right to refuse service to anyone who does not meet these eligibility criteria.",
  },
  {
    id: 3,
    title: "Booking & Payment",
    content:
      "All bookings on GO GAARI are subject to vehicle availability. Prices are displayed in BDT (Bangladeshi Taka) and include applicable taxes unless stated otherwise. Payments are processed securely through SSLCommerz. You may pay using credit cards, debit cards, mobile banking, or other methods supported by SSLCommerz. A booking is confirmed only after successful payment. GO GAARI reserves the right to cancel bookings if payment verification fails.",
  },
  {
    id: 4,
    title: "Cancellation & Refunds",
    content:
      "Cancellations are governed by our Cancellation Policy. In summary: cancellations made 48 or more hours before the scheduled pickup time are eligible for a full refund; cancellations made between 24 and 48 hours before pickup receive a 50% refund; cancellations made less than 24 hours before pickup are non-refundable. Refunds are processed via SSLCommerz and typically take 5–7 business days to reflect in your account. For full details, please refer to our Cancellation Policy page.",
  },
  {
    id: 5,
    title: "Vehicle Usage Rules",
    content:
      "Rented vehicles must be used in accordance with all applicable traffic laws and regulations of Bangladesh. The following are strictly prohibited: (a) using the vehicle for any unlawful purpose; (b) sub-letting or lending the vehicle to a third party; (c) driving under the influence of alcohol or drugs; (d) transporting hazardous materials; (e) driving outside Bangladesh without prior written approval; (f) racing, rallying, or any form of reckless driving. The renter is responsible for all traffic fines and toll charges incurred during the rental period.",
  },
  {
    id: 6,
    title: "Liability & Insurance",
    content:
      "GO GAARI provides basic vehicle insurance coverage as part of the rental agreement. This covers damage to the vehicle from accidents, subject to an excess amount specified at the time of booking. The renter is liable for any damage caused by negligence, violation of usage rules, or misuse of the vehicle. GO GAARI is not liable for loss of personal belongings left in the vehicle, delays caused by traffic or road conditions, or any consequential losses arising from the rental.",
  },
  {
    id: 7,
    title: "Privacy",
    content:
      "Your personal data is handled in accordance with our Privacy Policy. By using GO GAARI, you consent to the collection and processing of your data as described therein.",
    hasPrivacyLink: true,
  },
  {
    id: 8,
    title: "Modifications to Terms",
    content:
      "GO GAARI reserves the right to modify these Terms & Conditions at any time. Changes will be posted on this page with an updated revision date. It is your responsibility to review these terms periodically. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.",
  },
  {
    id: 9,
    title: "Governing Law",
    content:
      'These Terms & Conditions are governed by and construed in accordance with the laws of the People\'s Republic of Bangladesh. Any disputes arising from the use of GO GAARI\'s services shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Last updated: 1 March 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-gray-700 leading-relaxed mb-8">
          Welcome to GO GAARI. These Terms &amp; Conditions govern your use of
          our car rental platform and the services we provide across Bangladesh.
          Please read them carefully before using our services.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.id}
              className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#65AA36" }}
                >
                  {section.id}
                </span>
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed pl-10">
                {section.content}
                {section.hasPrivacyLink && (
                  <>
                    {" "}
                    <Link
                      href="/privacy"
                      className="font-medium underline hover:no-underline"
                      style={{ color: "#65AA36" }}
                    >
                      View our Privacy Policy
                    </Link>
                    .
                  </>
                )}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            If you have any questions about these terms, please{" "}
            <Link
              href="/support"
              className="font-medium underline hover:no-underline"
              style={{ color: "#65AA36" }}
            >
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
