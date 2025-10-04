'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Scale, FileText, Users, Lock, AlertCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 z-50 w-full bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-red-600 text-2xl font-bold">
              ReactorHub
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center text-sm text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-400">Last updated: January 24, 2025</p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using ReactorHub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold">2. User Accounts</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">2.1 Account Types:</strong> ReactorHub offers two types of accounts:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong className="text-white">Patron Accounts:</strong> For users who want to watch reaction content</li>
                  <li><strong className="text-white">Creator Accounts:</strong> For content creators who upload and share reactions</li>
                </ul>
                <p className="leading-relaxed">
                  <strong className="text-white">2.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">2.3 Age Requirement:</strong> You must be at least 13 years old to use this service. By creating an account, you confirm that you meet this age requirement.
                </p>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold">3. Content Guidelines</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">3.1 Creator Content:</strong> Creators are solely responsible for the content they upload. Content must comply with all applicable laws and may not infringe on any third-party rights.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">3.2 Prohibited Content:</strong> The following content is strictly prohibited:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Copyrighted material without proper authorization</li>
                  <li>Harmful, threatening, abusive, or hateful content</li>
                  <li>Sexually explicit or violent material</li>
                  <li>Content that violates any laws or regulations</li>
                </ul>
                <p className="leading-relaxed">
                  <strong className="text-white">3.3 Content Moderation:</strong> We reserve the right to remove any content that violates these terms without prior notice.
                </p>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold">4. Privacy and Data Protection</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your use of ReactorHub is also governed by our Privacy Policy. By using our service, you consent to the collection and use of information as outlined in our Privacy Policy.
              </p>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
                <h2 className="text-2xl font-semibold">5. Disclaimers and Limitations</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">5.1 Service Availability:</strong> ReactorHub is provided "as is" without any warranties, expressed or implied. We do not guarantee that the service will be uninterrupted or error-free.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">5.2 Third-Party Content:</strong> ReactorHub acts as a platform for creators to share content. We are not responsible for the accuracy, completeness, or usefulness of any content posted by users.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">5.3 Limitation of Liability:</strong> In no event shall ReactorHub be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
                </p>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">6. Modifications to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of ReactorHub after any modifications indicates your acceptance of the updated terms.
              </p>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 text-gray-300">
                <p>Email: legal@reactorhub.com</p>
                <p>Address: ReactorHub, Inc.</p>
                <p>123 Streaming Lane</p>
                <p>Los Angeles, CA 90001</p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              By using ReactorHub, you acknowledge that you have read and understood these terms.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/privacy" className="text-red-600 hover:text-red-500">
                Privacy Policy
              </Link>
              <Link href="/" className="text-red-600 hover:text-red-500">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}