"use client";
import { useState } from "react";

export default function PrivacyPolicy() {
  const [effectiveDate] = useState("May 18, 2025");
  const contactEmail = "privacy@platter.com";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-wide mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-primary py-6 px-6">
            <h1 className="text-3xl font-bold text-white">
              Privacy Policy for Platter
            </h1>
            <p className="text-primary-100 mt-2">
              Effective Date: {effectiveDate}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                At Platter, we are committed to protecting the privacy and
                security of our users. This Privacy Policy outlines how we
                collect, use, disclose, and safeguard your information when you
                access or use Platter's applications, including the Landing
                Site, Admin App, Guest App, and Server App (collectively, the
                "Service"). By using the Service, you consent to the data
                practices described in this policy.
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  1. Information We Collect
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    1.1 <strong>Personal Information:</strong> When you create
                    an account, place an order, leave a review, or submit a
                    complaint, we may collect personal information such as your
                    name, email address, phone number, and order details.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    1.2 <strong>Usage Data:</strong> We may collect information
                    about how you access and use the Service, including device
                    information, IP address, browser type, access times, and
                    pages viewed.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    1.3 <strong>Cookies and Tracking Technologies:</strong> We
                    use cookies and similar tracking technologies to monitor and
                    analyze user activity on the Service and to improve user
                    experience.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  2. How We Use Your Information
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    2.1 We may use the collected information to:
                  </p>
                  <ul className="list-disc pl-8 mb-4 text-gray-700">
                    <li className="mb-2">
                      Process orders and provide the requested services.
                    </li>
                    <li className="mb-2">
                      Improve and personalize the user experience.
                    </li>
                    <li className="mb-2">
                      Communicate with users regarding their orders, complaints,
                      or reviews.
                    </li>
                    <li className="mb-2">
                      Conduct data analysis and monitor usage patterns.
                    </li>
                    <li className="mb-2">
                      Enforce our Terms and Conditions and prevent fraudulent
                      activities.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  3. Data Sharing and Disclosure
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    3.1 We may share your information with:
                  </p>
                  <ul className="list-disc pl-8 mb-4 text-gray-700">
                    <li className="mb-2">
                      <strong>Service Providers:</strong> Third-party vendors
                      that assist in operating the Service, such as payment
                      processors and analytics providers.
                    </li>
                    <li className="mb-2">
                      <strong>Legal Compliance:</strong> Authorities when
                      required to comply with applicable laws, regulations, or
                      legal processes.
                    </li>
                  </ul>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    3.2 We do not sell user data to third parties.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  4. Data Retention
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    4.1 We retain personal information only as long as necessary
                    to provide the Service and fulfill the purposes outlined in
                    this policy.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    4.2 Users may request deletion of their data by contacting
                    us at{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      {contactEmail}
                    </a>
                    .
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  5. Data Security
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    5.1 We implement appropriate security measures to protect
                    personal information against unauthorized access,
                    alteration, disclosure, or destruction.
                  </p>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    5.2 However, no method of data transmission or storage is
                    100% secure. While we strive to protect your information, we
                    cannot guarantee absolute security.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  6. User Rights
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    6.1 Users have the right to:
                  </p>
                  <ul className="list-disc pl-8 mb-4 text-gray-700">
                    <li className="mb-2">
                      Access, update, or delete their personal information.
                    </li>
                    <li className="mb-2">
                      Withdraw consent for data processing where applicable.
                    </li>
                    <li className="mb-2">
                      Request information on how their data is being processed.
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  7. Children's Privacy
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    7.1 The Service is not intended for users under the age of
                    13. We do not knowingly collect personal information from
                    children. If we become aware of such data, we will take
                    steps to delete it promptly.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  8. Changes to This Privacy Policy
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    8.1 We reserve the right to update this Privacy Policy at
                    any time. The updated policy will be posted on the Service
                    with a revised "Effective Date."
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  9. Contact Us
                </h2>
                <div className="pl-4">
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    If you have any questions, concerns, or requests regarding
                    this Privacy Policy, please contact us at{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      {contactEmail}
                    </a>
                    .
                  </p>
                </div>
              </section>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-gray-600 italic">
                  For further information about how we handle your data, please
                  contact our support team.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Platter. All rights reserved.
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Accept Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
