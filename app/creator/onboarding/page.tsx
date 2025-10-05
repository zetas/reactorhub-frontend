'use client';

import { useState } from 'react';
import { ChevronRight, Check, Film, Users, TrendingUp, Shield, DollarSign, Zap } from 'lucide-react';
import { auth } from '@/lib/api';

const features = [
  {
    icon: Film,
    title: 'Organized Content',
    description: 'Your reactions automatically organized into series and episodes'
  },
  {
    icon: Users,
    title: 'Patron Management',
    description: 'See which patrons have access to your content'
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Track views, engagement, and growth metrics'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your creator platform data is encrypted and never shared'
  },
  {
    icon: DollarSign,
    title: 'Free Forever',
    description: 'No fees, no commissions, just better organization'
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Connect creator platform and start immediately'
  }
];

export default function CreatorOnboarding() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [step, setStep] = useState(1);

  const handleConnectCreatorPlatform = async () => {
    setIsConnecting(true);
    try {
      // This will redirect to Creator Platform OAuth
      await auth.connectCreatorPlatform();
    } catch (error) {
      console.error('Failed to connect Creator Platform:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="fixed top-0 w-full bg-black/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600">ReeActor</h1>
            <div className="text-sm text-gray-400">
              Creator Onboarding
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your Creator Content into a{' '}
            <span className="text-red-600">Streaming Experience</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Give your patrons a premium viewing experience with automatic series organization,
            progress tracking, and a beautiful interface they&apos;ll love to use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleConnectCreatorPlatform}
              disabled={isConnecting}
              className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect with Creator Platform
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
            <button className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition">
              Watch Demo
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Takes 30 seconds • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Delight Your Patrons
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-600 transition"
              >
                <feature.icon className="h-10 w-10 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Get Started in 3 Simple Steps
          </h2>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Connect Your Creator Platform',
                description: 'Securely link your creator platform account with one click'
              },
              {
                step: 2,
                title: 'Content Automatically Organizes',
                description: 'We automatically detect and organize your series, episodes, and movies'
              },
              {
                step: 3,
                title: 'Share with Patrons',
                description: 'Send your patrons a link to start watching in the streaming-style interface'
              }
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= item.step ? 'bg-red-600' : 'bg-gray-800'
                }`}>
                  {step > item.step ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-white font-semibold">{item.step}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gradient-to-b from-red-900/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Creators' },
              { value: '1M+', label: 'Videos Organized' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9★', label: 'Creator Rating' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-red-600 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Give Your Patrons a Premium Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are delighting their patrons with ReeActor
          </p>
          <button
            onClick={handleConnectCreatorPlatform}
            disabled={isConnecting}
            className="px-12 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Start Free with Creator Platform
          </button>
        </div>
      </section>
    </div>
  );
}