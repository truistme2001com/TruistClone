import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-400 mb-6" data-testid="text-page-title">
            Privacy Policy
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Last Updated:</strong> November 1, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We collect information that you provide directly to us, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Account credentials and authentication information</li>
                <li>Financial information necessary for banking services</li>
                <li>Transaction history and account activity</li>
                <li>Communication preferences and customer service interactions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Provide, maintain, and improve our banking services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and security alerts</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Protect against, identify, and prevent fraud and other illegal activities</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                3. Information Sharing
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>With your consent or at your direction</li>
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations or respond to lawful requests</li>
                <li>To protect the rights, property, and safety of Truist, our users, and the public</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                4. Data Security
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We implement industry-standard security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Strict access controls and authentication procedures</li>
                <li>Employee training on data privacy and security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                5. Your Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of certain data processing activities</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                6. Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                <strong>Email:</strong> privacy@truist.com<br />
                <strong>Phone:</strong> 844-4TRUIST (844-487-8478)<br />
                <strong>Address:</strong> Truist Financial Corporation, 214 N Tryon St, Charlotte, NC 28202
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
