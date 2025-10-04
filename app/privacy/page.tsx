'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Globe, Lock, Mail, Cookie } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: January 24, 2025</p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-8">
            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">1.1 Personal Information:</strong> When you create an account, we collect:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Name and email address</li>
                  <li>Account type (Patron or Creator)</li>
                  <li>Password (encrypted and secure)</li>
                  <li>Profile information you choose to provide</li>
                </ul>
                <p className="leading-relaxed">
                  <strong className="text-white">1.2 Usage Information:</strong> We automatically collect:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Watch history and viewing preferences</li>
                  <li>Content interaction data (likes, saves, shares)</li>
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                </ul>
                <p className="leading-relaxed">
                  <strong className="text-white">1.3 Third-Party Data:</strong> If you connect via OAuth providers:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Creator subscription information</li>
                  <li>Discord user ID and username</li>
                  <li>Google account basic profile data</li>
                </ul>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">We use your information to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Provide and maintain our service</li>
                  <li>Personalize your content recommendations</li>
                  <li>Process transactions and manage subscriptions</li>
                  <li>Send important service updates and notifications</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Protect against fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">3.1 We do NOT sell your personal information.</strong>
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">3.2 We may share information with:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong className="text-white">Service Providers:</strong> Companies that help us operate our platform (hosting, analytics, payment processing)</li>
                  <li><strong className="text-white">Creators:</strong> Basic analytics about their content performance (no personal identifying information)</li>
                  <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                  <li><strong className="text-white">Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Cookie className="h-6 w-6 text-yellow-600 mr-3" />
                <h2 className="text-2xl font-semibold">4. Cookies and Tracking</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Keep you logged in</li>
                  <li>Remember your preferences</li>
                  <li>Analyze site traffic and usage</li>
                  <li>Personalize content recommendations</li>
                </ul>
                <p className="leading-relaxed">
                  You can control cookie settings through your browser, but disabling cookies may limit functionality.
                </p>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold">5. Data Security</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Strict access controls and authentication</li>
                  <li>Secure data centers with physical security</li>
                </ul>
                <p className="leading-relaxed">
                  However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                  <li><strong className="text-white">Correction:</strong> Update or correct your information</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong className="text-white">Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
                <p className="leading-relaxed">
                  To exercise these rights, contact us at privacy@reactorhub.com
                </p>
              </div>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                ReactorHub is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
              </p>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. For significant changes, we will provide additional notice via email or platform notification.
              </p>
            </section>

            <section className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-2xl font-semibold">10. Contact Us</h2>
              </div>
              <div className="text-gray-300">
                <p className="mb-4">For privacy-related questions or concerns:</p>
                <p><strong className="text-white">Email:</strong> privacy@reactorhub.com</p>
                <p><strong className="text-white">Data Protection Officer:</strong> dpo@reactorhub.com</p>
                <p className="mt-4"><strong className="text-white">Mailing Address:</strong></p>
                <p>ReactorHub, Inc.</p>
                <p>Attn: Privacy Team</p>
                <p>123 Streaming Lane</p>
                <p>Los Angeles, CA 90001</p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Your privacy is important to us. This policy explains how we handle your data with care and respect.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/terms" className="text-red-600 hover:text-red-500">
                Terms of Service
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