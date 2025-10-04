'use client';

import { Heart } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Free Forever</h1>
          <p className="text-2xl text-gray-300 mb-4">
            ReactorHub is completely free for everyone.
          </p>
          <p className="text-lg text-gray-400">
            No ads, no paywalls, no premium tiers. Just a better way to watch your favorite creators.
          </p>
        </div>

        {/* Donation Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-10 border border-red-600/20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 rounded-full mb-6">
              <Heart className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Support ReactorHub</h2>
            <p className="text-gray-300 mb-8 text-lg">
              If you find ReactorHub useful and want to help cover server costs,
              donations are gratefully accepted via PayPal.
            </p>
            <a
              href="#"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition shadow-lg hover:shadow-xl"
            >
              Donate via PayPal
            </a>
            <p className="text-sm text-gray-500 mt-6">
              100% of donations go directly to hosting and development costs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}