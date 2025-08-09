"use client";
import { useState } from "react";

export default function TermsAndConditions() {
  const [effectiveDate] = useState("May 18, 2025");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-wide mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary py-6 px-6">
            <h1 className="text-3xl font-bold text-white">
              Terms and Conditions for Platter
            </h1>
            <p className="text-primary-100 mt-2">
              Effective Date: {effectiveDate}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Welcome to Platter, a QR ordering service for in-dining
                restaurants in Nigeria. These Terms and Conditions ("Terms")
                govern your use of PlatterNG's applications, including the
                Landing Site, Admin App, Guest App, and Server App
                (collectively, the "Service"). By accessing or using the
                Service, you agree to be bound by these Terms.
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  1. Acceptance of Terms
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    1.1 By accessing, downloading, or using the Service, you
                    confirm that you have read, understood, and agree to be
                    bound by these Terms. If you do not agree to these Terms,
                    you may not use the Service.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    1.2 Platter reserves the right to modify, amend, or update
                    these Terms at any time without prior notice. Any changes
                    will be effective immediately upon posting. Your continued
                    use of the Service constitutes acceptance of the revised
                    Terms.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  2. User Obligations and Responsibilities
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    2.1 Users are responsible for maintaining the
                    confidentiality of their login credentials and for all
                    activities that occur under their account.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    2.2 Users agree to use the Service only for lawful purposes
                    and in accordance with these Terms. You shall not:
                  </p>
                  <ul className="list-disc pl-8 mb-4 text-gray-700">
                    <li className="mb-2">
                      Use the Service in any manner that violates any applicable
                      law or regulation.
                    </li>
                    <li className="mb-2">
                      Engage in fraudulent, deceptive, or misleading practices.
                    </li>
                    <li className="mb-2">
                      Interfere with, disrupt, or attempt to gain unauthorized
                      access to the Service or its related systems.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  3. Intellectual Property Rights
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    3.1 Platter and its licensors retain all rights, title, and
                    interest in and to the Service, including but not limited to
                    all content, trademarks, and logos. Unauthorized use of any
                    content or intellectual property is strictly prohibited.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    3.2 Users retain ownership of content they submit to the
                    Service, including orders, reviews, and complaints. However,
                    by submitting such content, users grant Platter a
                    non-exclusive, worldwide, royalty-free license to use,
                    display, and distribute such content for the purpose of
                    operating and improving the Service.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  4. Data Privacy and Usage
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    4.1 Platter collects and processes personal information in
                    accordance with its Privacy Policy, which is incorporated by
                    reference into these Terms.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    4.2 Platter may collect data related to orders, reviews,
                    complaints, and other interactions within the Service. This
                    data may be used for analytics, service improvement, and
                    marketing purposes.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    4.3 Users are prohibited from sharing sensitive personal
                    information, such as financial data or identification
                    numbers, through the Service.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  5. Payments and Refunds
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    5.1 Platter is not liable for any payments made through the
                    Service. All payments are processed through third-party
                    payment processors, and any payment disputes must be
                    resolved with the respective processor.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    5.2 Refunds, if applicable, will be handled by the
                    restaurant in accordance with their specific refund
                    policies.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  6. Service Limitations and Termination
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    6.1 Platter reserves the right to suspend or terminate user
                    access to the Service for violations of these Terms,
                    including but not limited to unauthorized use, fraudulent
                    activity, or disruptive behavior.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    6.2 PlatterNG does not guarantee uninterrupted or error-free
                    access to the Service and is not responsible for any delays,
                    interruptions, or data loss.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  7. Dispute Resolution and Governing Law
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    7.1 These Terms shall be governed by and construed in
                    accordance with the laws of Nigeria.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    7.2 Any disputes arising out of or related to these Terms
                    shall be resolved through negotiation in good faith. If a
                    resolution cannot be reached, the dispute shall be submitted
                    to binding arbitration in Nigeria.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  8. Third-Party Services and Links
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    8.1 The Service may contain links to third-party websites or
                    services that are not owned or controlled by PlatterNG.
                    PlatterNG is not responsible for the content, privacy
                    policies, or practices of such third parties.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    8.2 Users acknowledge and agree that Platter is not liable
                    for any loss or damage arising from their use of third-party
                    services or links.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  9. Miscellaneous
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    9.1 If any provision of these Terms is found to be invalid
                    or unenforceable, such provision shall be deemed modified to
                    the extent necessary to render it enforceable, and all other
                    provisions shall remain in full force and effect.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    9.2 Failure by Platte to enforce any right or provision
                    under these Terms shall not constitute a waiver of such
                    right or provision.
                  </p>
                </div>
              </section>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-gray-600 italic">
                  For further information or questions regarding these Terms,
                  please contact our support team.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Platter. All rights reserved.
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Accept Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
