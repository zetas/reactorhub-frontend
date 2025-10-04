'use client';

import { Heart, Coffee } from 'lucide-react';

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
          <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-10 border border-red-600/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 rounded-full mb-6">
                <Heart className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Support ReactorHub</h2>
              <p className="text-gray-300 text-lg">
                If you find ReactorHub useful and want to help cover server costs,
                consider supporting our development!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start bg-gray-800/50 rounded-lg p-5">
                <Coffee className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Buy us a coffee</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    One-time donations help cover server costs and keep the lights on.
                  </p>
                  <a
                    href="#"
                    className="inline-block px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
                  >
                    Donate via Ko-fi
                  </a>
                </div>
              </div>

              <div className="flex items-start bg-gray-800/50 rounded-lg p-5">
                <Heart className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Become a supporter</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Monthly supporters help sustain development and get early access to new features.
                  </p>
                  <a
                    href="#"
                    className="inline-block px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
                  >
                    Support on Patreon
                  </a>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  100% of donations go directly to development and hosting costs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}