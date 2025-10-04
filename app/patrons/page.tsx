'use client';

import { useRouter } from 'next/navigation';
import { Film, Users, Clock, Tv } from 'lucide-react';

export default function ForPatronsPage() {
  const router = useRouter();

  const features = [
    {
      icon: Film,
      title: 'All Your Creators',
      description: 'Access content from all your supported creators in one place'
    },
    {
      icon: Tv,
      title: 'Streaming Experience',
      description: 'Browse and watch like your favorite streaming platforms'
    },
    {
      icon: Clock,
      title: 'Never Miss Content',
      description: 'Track progress and get notified of new releases'
    },
    {
      icon: Users,
      title: 'Discover Creators',
      description: 'Find new creators to support based on your interests'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Watch Like You <span className="text-red-600">Stream</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Experience your supported creators' content with a premium streaming interface
          </p>
          <button
            onClick={() => router.push('/auth/signup')}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all"
          >
            Start Watching Free
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Enhanced Viewing Experience</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 bg-gray-800 rounded-lg">
                <feature.icon className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: 1, title: 'Sign Up Free', description: 'Create your free ReactorHub account in seconds' },
              { step: 2, title: 'Connect Your Subscriptions', description: 'Link your supported creators securely' },
              { step: 3, title: 'Start Watching', description: 'Enjoy all content in one beautiful interface' }
            ].map((item) => (
              <div key={item.step} className="flex items-center space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Upgrade Your Viewing?</h2>
          <button
            onClick={() => router.push('/auth/signup')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-red-500/50 transition-all"
          >
            Join ReactorHub Free
          </button>
        </div>
      </section>
    </div>
  );
}