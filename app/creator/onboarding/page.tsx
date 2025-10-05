'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, ChevronLeft, Check, Film, Users, TrendingUp,
  Shield, DollarSign, Zap, Play, Settings, Eye, Calendar,
  BarChart, Bell, Sparkles
} from 'lucide-react';
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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: true,
    autoPublish: true,
    weeklyDigest: false,
  });

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

  const handleComplete = () => {
    router.push('/creator/dashboard');
  };

  const steps = [
    {
      title: 'Welcome to ReeActor',
      subtitle: "Let's get your creator account set up",
      component: <WelcomeStep onConnect={handleConnectCreatorPlatform} isConnecting={isConnecting} />
    },
    {
      title: 'Connect Your Platform',
      subtitle: 'Link your Patreon account to sync content',
      component: <ConnectStep onConnect={handleConnectCreatorPlatform} isConnecting={isConnecting} />
    },
    {
      title: 'Customize Settings',
      subtitle: 'Configure your preferences',
      component: <SettingsStep preferences={preferences} setPreferences={setPreferences} />
    },
    {
      title: 'Preview Your Dashboard',
      subtitle: 'See what your patrons will experience',
      component: <PreviewStep onComplete={handleComplete} />
    }
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="fixed top-0 w-full bg-black/50 backdrop-blur-sm z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600">ReeActor</h1>
            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                  ${index <= currentStep
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                    : 'bg-gray-700 text-gray-400'}
                  ${index === currentStep ? 'scale-110' : 'scale-100'}
                `}>
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 sm:w-24 h-1 mx-2 transition-all duration-300
                    ${index < currentStep ? 'bg-red-600' : 'bg-gray-700'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Step Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">{steps[currentStep].title}</h2>
            <p className="text-xl text-gray-400">{steps[currentStep].subtitle}</p>
          </div>

          {/* Step Content */}
          <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6 sm:p-8 mb-8 min-h-[400px]">
            {steps[currentStep].component}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition
                ${currentStep === 0
                  ? 'opacity-0 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-700 text-white'}
              `}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={goToNextStep}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition shadow-lg shadow-red-600/50"
              >
                Get Started
                <Sparkles className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Welcome
function WelcomeStep({ onConnect, isConnecting }: { onConnect: () => void, isConnecting: boolean }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">
          Transform Your Creator Content into a{' '}
          <span className="text-red-600">Streaming Experience</span>
        </h3>
        <p className="text-gray-300 text-lg">
          Give your patrons a premium viewing experience with automatic series organization,
          progress tracking, and a beautiful interface they&apos;ll love to use.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        {features.slice(0, 4).map((feature, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-red-600 transition"
          >
            <feature.icon className="h-8 w-8 text-red-600 mb-3" />
            <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 p-6 bg-gradient-to-r from-red-900/20 to-transparent rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">10K+</div>
          <div className="text-sm text-gray-400">Creators</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">1M+</div>
          <div className="text-sm text-gray-400">Videos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">99.9%</div>
          <div className="text-sm text-gray-400">Uptime</div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Connect Platform
function ConnectStep({ onConnect, isConnecting }: { onConnect: () => void, isConnecting: boolean }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Connect Your Creator Platform</h3>
        <p className="text-gray-400">
          Securely link your Patreon account to automatically sync your content and patrons
        </p>
      </div>

      {/* Platform Connection Card */}
      <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700 hover:border-red-600 transition">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">P</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Patreon</h4>
              <p className="text-sm text-gray-400">Connect your Patreon account</p>
            </div>
          </div>
          <Shield className="w-6 h-6 text-green-500" />
        </div>

        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Connecting...
            </>
          ) : (
            <>
              Connect with Patreon
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-300 font-medium mb-1">Your data is secure</p>
          <p className="text-gray-400">
            We use OAuth 2.0 authentication and never store your Patreon password.
            We only request read access to organize your content.
          </p>
        </div>
      </div>

      {/* What happens next */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-300">What happens next:</p>
        <div className="space-y-2">
          {[
            'You\'ll be redirected to Patreon to authorize access',
            'We\'ll import your posts and organize them into series',
            'Your patrons can start watching with their existing Patreon tiers',
            'You\'ll get access to detailed analytics and insights'
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-gray-400">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 3: Settings
function SettingsStep({
  preferences,
  setPreferences
}: {
  preferences: any,
  setPreferences: (prefs: any) => void
}) {
  const togglePreference = (key: string) => {
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Customize Your Settings</h3>
        <p className="text-gray-400">
          Configure how you want to manage your content and interact with patrons
        </p>
      </div>

      {/* Settings Options */}
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold">Email Notifications</h4>
              </div>
              <p className="text-sm text-gray-400">
                Get notified when patrons comment or interact with your content
              </p>
            </div>
            <button
              onClick={() => togglePreference('notifications')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${preferences.notifications ? 'bg-red-600' : 'bg-gray-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${preferences.notifications ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Play className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold">Auto-Publish New Content</h4>
              </div>
              <p className="text-sm text-gray-400">
                Automatically make new Patreon posts available to corresponding tier patrons
              </p>
            </div>
            <button
              onClick={() => togglePreference('autoPublish')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${preferences.autoPublish ? 'bg-red-600' : 'bg-gray-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${preferences.autoPublish ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <BarChart className="w-5 h-5 text-yellow-400" />
                <h4 className="font-semibold">Weekly Analytics Digest</h4>
              </div>
              <p className="text-sm text-gray-400">
                Receive a weekly summary of your views, engagement, and top content
              </p>
            </div>
            <button
              onClick={() => togglePreference('weeklyDigest')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${preferences.weeklyDigest ? 'bg-red-600' : 'bg-gray-600'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${preferences.weeklyDigest ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <p className="text-sm text-gray-400">
          <span className="font-medium text-white">Note:</span> You can change these settings anytime
          from your creator dashboard settings page.
        </p>
      </div>
    </div>
  );
}

// Step 4: Preview
function PreviewStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Your Dashboard Preview</h3>
        <p className="text-gray-400">
          Here's what you and your patrons will see
        </p>
      </div>

      {/* Dashboard Preview Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 rounded-lg p-5 border border-blue-800/50">
          <Film className="w-8 h-8 text-blue-400 mb-3" />
          <h4 className="font-semibold mb-2">Content Library</h4>
          <p className="text-sm text-gray-400 mb-4">
            All your Patreon posts organized into series and episodes with beautiful thumbnails
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <Play className="w-4 h-4" />
            <span>Auto-organized by show name</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 rounded-lg p-5 border border-purple-800/50">
          <Users className="w-8 h-8 text-purple-400 mb-3" />
          <h4 className="font-semibold mb-2">Patron Insights</h4>
          <p className="text-sm text-gray-400 mb-4">
            See which patrons have access to your content and how they're engaging
          </p>
          <div className="flex items-center gap-2 text-sm text-purple-400">
            <TrendingUp className="w-4 h-4" />
            <span>Real-time engagement metrics</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 rounded-lg p-5 border border-green-800/50">
          <BarChart className="w-8 h-8 text-green-400 mb-3" />
          <h4 className="font-semibold mb-2">Analytics Dashboard</h4>
          <p className="text-sm text-gray-400 mb-4">
            Track views, watch time, and engagement across all your content
          </p>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Calendar className="w-4 h-4" />
            <span>Daily, weekly, and monthly reports</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-red-800/10 rounded-lg p-5 border border-red-800/50">
          <Sparkles className="w-8 h-8 text-red-400 mb-3" />
          <h4 className="font-semibold mb-2">Premium Experience</h4>
          <p className="text-sm text-gray-400 mb-4">
            Give your patrons a Netflix-style viewing experience they'll love
          </p>
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Shield className="w-4 h-4" />
            <span>Secure and private</span>
          </div>
        </div>
      </div>

      {/* Ready to Launch */}
      <div className="p-6 bg-gradient-to-r from-red-900/20 to-transparent border border-red-800/50 rounded-lg text-center">
        <h4 className="text-xl font-bold mb-2">You're All Set!</h4>
        <p className="text-gray-400 mb-4">
          Click "Get Started" to access your creator dashboard and start delighting your patrons
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-gray-300">Account Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-gray-300">Settings Configured</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-gray-300">Ready to Launch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
