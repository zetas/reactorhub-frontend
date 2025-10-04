'use client';

import { Check } from 'lucide-react';
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
          <h1 className="text-4xl font-bold mb-4">Simple, Free Pricing</h1>
          <p className="text-xl text-gray-400">ReactorHub is completely free for everyone</p>
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
      </div>
    </div>
  );
}