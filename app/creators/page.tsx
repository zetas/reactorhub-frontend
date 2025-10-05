'use client';

import { useRouter } from 'next/navigation';
import { Crown, BarChart3, Users, Shield } from 'lucide-react';

export default function ForCreatorsPage() {
  const router = useRouter();

  const benefits = [
    {
      icon: Crown,
      title: 'Premium Experience',
      description: 'Give your patrons a streaming-quality viewing experience they deserve'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Understand what content resonates with insights on viewing patterns'
    },
    {
      icon: Users,
      title: 'Grow Your Audience',
      description: 'Discoverable platform helps new patrons find your content'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your content and patron data is protected with enterprise-grade security'
    }
  ];

  const creatorStats = [
    { label: 'Active Creators', value: '500+' },
    { label: 'Videos Organized', value: '50,000+' },
    { label: 'Happy Patrons', value: '10,000+' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 sm:pt-20 pb-20 md:pb-6">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="heading-h1 mb-6">
            Built for <span className="text-red-600">Creators</span>
          </h1>
          <p className="body-large text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform how your patrons experience your reaction content with a premium streaming platform
          </p>
          <button
            onClick={() => router.push('/creator/onboarding')}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all"
          >
            Start Your Journey
          </button>

          {/* Social Proof Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {creatorStats.map((stat, index) => (
              <div key={index} className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
                <div className="text-3xl font-bold text-red-500 mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="heading-h2 text-center mb-12">Why Creators Choose ReeActor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="p-6 sm:p-8 bg-gray-800 rounded-lg">
                <benefit.icon className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="heading-h4 mb-3">{benefit.title}</h3>
                <p className="body-text text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-red-900/50 to-purple-900/50 rounded-2xl p-8 sm:p-12">
          <h2 className="heading-h2 mb-4">Ready to Elevate Your Content?</h2>
          <p className="body-large text-gray-300 mb-8">
            Join hundreds of creators already using ReeActor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/creator/onboarding')}
              className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all"
            >
              Get Started Free
            </button>
            <button
              onClick={() => router.push('/features')}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}