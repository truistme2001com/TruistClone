import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
            Terms of Service
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Last Updated:</strong> November 1, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By accessing and using Truist banking services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                2. Account Registration
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                To use our services, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Be at least 18 years of age</li>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                3. Account Usage
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree to use our services only for lawful purposes. You must not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Engage in any fraudulent, abusive, or illegal activity</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with the security or integrity of our systems</li>
                <li>Attempt to gain unauthorized access to other accounts</li>
                <li>Use automated systems to access our services without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                4. Fees and Payments
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree to pay all fees associated with your account as disclosed in our fee schedule. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Change our fees with advance notice</li>
                <li>Charge fees for overdrafts, returned items, and other services</li>
                <li>Deduct fees directly from your account balance</li>
                <li>Suspend or close accounts with unpaid fees</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                5. Transactions and Transfers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                All transactions are subject to our verification and approval processes. We may:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Delay or reject transactions for security or compliance reasons</li>
                <li>Set transaction limits based on your account type</li>
                <li>Require additional verification for large or unusual transactions</li>
                <li>Reverse transactions that are unauthorized or fraudulent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                6. Liability and Disclaimers
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our services are provided "as is" without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Service interruptions or technical failures</li>
                <li>Unauthorized access to your account due to your negligence</li>
                <li>Actions of third-party service providers</li>
                <li>Losses resulting from your violation of these terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                7. Account Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may suspend or terminate your account at any time for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent or illegal activity</li>
                <li>Extended period of inactivity</li>
                <li>Failure to maintain required minimum balances</li>
                <li>At our discretion with appropriate notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                8. Dispute Resolution
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to participate in class action lawsuits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We reserve the right to modify these terms at any time. We will notify you of significant changes via email or account notification. Your continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                For questions about these Terms of Service, contact us at:
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                <strong>Email:</strong> legal@truist.com<br />
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
