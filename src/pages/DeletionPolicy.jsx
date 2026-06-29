
// src/pages/DeletionPolicy.jsx

export default function DeletionPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white">
      <h1 className="text-4xl font-bold mb-2">
        Data Deletion Policy
      </h1>

      <p className="text-gray-600 mb-8">
        Last Updated: June 18, 2026
      </p>

      <div className="space-y-8 text-gray-700 leading-8">
        <p>
          At <strong>Sport Fitness Club</strong>, we respect your privacy and
          provide users with the ability to request deletion of their account
          and associated personal information.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Requesting Account Deletion
          </h2>

          <p>
            Users may request deletion of their account by contacting us through
            the contact information provided below.
          </p>

          <p className="mt-3">
            We may require identity verification before processing deletion
            requests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. Information That May Be Deleted
          </h2>

          <ul className="list-disc pl-6 space-y-2">
                <li>Name</li>
            <li>Mobile Number</li>
            
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Information We May Retain
          </h2>

          <p>
            Certain information may be retained where required by law,
            regulatory requirements, fraud prevention, financial recordkeeping,
            or dispute resolution.
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>Payment Records</li>
            <li>Transaction References</li>
            <li>Tax Records</li>
            <li>Fraud Prevention Records</li>
            <li>Security Logs</li>
            <li>Legal Compliance Records</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Processing Time
          </h2>

          <p>
            Verified deletion requests are typically processed within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. Third-Party Services
          </h2>

          <p>
            Where applicable, we will take reasonable steps to request deletion
            of personal information shared with authorized third-party service
            providers.
          </p>

          <p className="mt-3">
            Certain payment-related records processed by Razorpay may be
            retained according to applicable legal and regulatory requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            6. Children's Data
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <p className="font-semibold">
              This application is not intended for children under 13 years of
              age.
            </p>

            <p className="mt-3">
              If we become aware that personal information belonging to a child
              under 13 has been collected, we will take reasonable steps to
              remove that information.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            7. Contact Us
          </h2>

          <div className="bg-gray-100 rounded-lg p-5">
            <p>
              <strong>Sport Fitness Club</strong>
            </p>

            <p>Email: supportpreetam@gmail.com</p>
            <p>Phone: +91 8767534698</p>

            <p className="mt-3">
              To request account deletion, please email us with your registered
              mobile number and account details for verification.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}