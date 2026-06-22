
// src/pages/PrivacyPolicy.jsx

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white">
      <h1 className="text-4xl font-bold mb-2">
        Privacy Policy
      </h1>

      <p className="text-gray-600 mb-8">
        Last Updated: June 18, 2026
      </p>

      <div className="space-y-8 text-gray-700 leading-8">
        <p>
          Welcome to <strong>Sport Fitness Club</strong>. We respect your
          privacy and are committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, store, and protect
          your information when you use the Sport Fitness Club mobile
          application and related services.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Information We Collect
          </h2>

          <p className="mb-3">
            We may collect the following information:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Mobile Number</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. How We Use Your Information
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Create and manage member accounts</li>
            <li>Provide secure login access</li>
            <li>Manage memberships and membership renewals</li>
            <li>Process activity bookings</li>
            <li>Track attendance records</li>
            <li>Generate member QR codes</li>
            <li>Process payments</li>
            <li>Provide customer support</li>
            <li>Improve app functionality and performance</li>
            <li>Prevent fraud and unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. App Permissions
          </h2>

          <h3 className="text-lg font-medium mb-2">
            Camera Permission
          </h3>

          <p>
            Used for QR code scanning and profile image capture where applicable.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">
            Storage / Gallery Permission
          </h3>

          <p>
            Used for selecting and uploading profile photographs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Payments
          </h2>

          <p>
            Membership purchases and activity purchases may be processed through
            Razorpay or authorized payment service providers.
          </p>

          <p className="mt-3">
            We do not store credit card numbers, debit card numbers, banking
            passwords, UPI PINs, or other sensitive payment credentials.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. Data Security
          </h2>

          <p>
            We implement reasonable technical and organizational safeguards to
            protect your information from unauthorized access, misuse,
            disclosure, or destruction.
          </p>

          <p className="mt-3">
            No method of internet transmission or electronic storage is
            completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            6. Sharing of Information
          </h2>

          <p className="mb-3">
            We do not sell, rent, or trade your personal information.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>When required by law</li>
            <li>For fraud prevention and security purposes</li>
            <li>To comply with legal obligations</li>
            <li>With trusted service providers necessary to operate the app</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Attendance, Memberships and Bookings
          </h2>

          <p>
            The application stores membership information, attendance records,
            booking history, activity enrollments, membership passes, and
            related information necessary to provide fitness club services.
          </p>

          <p className="mt-3">
            QR codes may be generated and used for member identification and
            attendance management.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            8. Data Retention
          </h2>

          <p>
            We retain information only for as long as necessary to provide our
            services, comply with legal obligations, resolve disputes, and
            maintain business records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            9. User Rights
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Access your information</li>
            <li>Correct inaccurate information</li>
            <li>Request account deletion</li>
            <li>Request data removal where legally permitted</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            10. Children's Privacy
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <p className="font-semibold">
              Sport Fitness Club is not intended for children under 13 years of
              age.
            </p>

            <p className="mt-3">
              We do not knowingly collect personal information from children
              under 13 years old. If such information is discovered, it will be
              removed as soon as reasonably possible.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            11. Changes to This Policy
          </h2>

          <p>
            We may update this Privacy Policy from time to time. Updates will be
            posted on this page with a revised date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            12. Contact Us
          </h2>

          <div className="bg-gray-100 rounded-lg p-5">
            <p>
              <strong>Sport Fitness Club</strong>
            </p>

            <p>Email: supportpreetam@gmail.com</p>
            <p>Phone: +91 8767534698</p>
          </div>
        </section>
      </div>
    </div>
  );
}