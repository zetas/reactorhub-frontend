'use client';

import { Check, Heart, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      name: 'Patron',
      price: 'Free',
      description: 'For viewers and supporters',
      features: [
        'Access to all supported creators',
        'Streaming-style interface',
        'Progress tracking',
        'Cross-device sync',
        'Watch history'
      ],
      cta: 'Start Watching',
      action: () => router.push('/auth/signup')
    },
    {
      name: 'Creator',
      price: 'Free',
      description: 'For content creators',
      features: [
        'Auto-sync from platform',
        'Content organization',
        'Patron analytics',
        'Series management',
        'Export tools'
      ],
      cta: 'Get Started',
      action: () => router.push('/creator/onboarding'),
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Free Forever</h1>
          <p className="text-xl text-gray-400">ReactorHub is completely free for creators and patrons</p>
          <p className="text-sm text-gray-500 mt-2">No ads, no paywalls, no premium tiers</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-xl ${
                plan.featured
                  ? 'bg-gradient-to-b from-red-900/50 to-gray-800 border-2 border-red-600'
                  : 'bg-gray-800'
              }`}
            >
              {plan.featured && (
                <div className="text-red-600 text-sm font-semibold mb-4">RECOMMENDED</div>
              )}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="text-3xl font-bold mb-2">{plan.price}</div>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.action}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.featured
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-2xl p-8 border border-red-600/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Love ReactorHub?</h2>
              <p className="text-gray-400">
                ReactorHub is a passion project built to serve the creator community.
                If you find value in what we do, consider supporting our development!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start bg-gray-800/50 rounded-lg p-4">
                <Coffee className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Buy us a coffee</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    One-time donations help cover server costs and keep the lights on.
                  </p>
                  <a
                    href="#"
                    className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
                  >
                    Donate via Ko-fi
                  </a>
                </div>
              </div>

              <div className="flex items-start bg-gray-800/50 rounded-lg p-4">
                <Heart className="h-6 w-6 text-red-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Become a supporter</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Monthly supporters get early access to new features and a supporter badge.
                  </p>
                  <a
                    href="#"
                    className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
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