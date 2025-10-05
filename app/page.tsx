'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Play, Film, Users, TrendingUp, Shield, Star, Check, Sparkles, Zap, Globe, Heart, BarChart3, Clock } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    // Redirect authenticated users
    if (isAuthenticated && user) {
      if (user.isCreator) {
        router.push('/creator/dashboard');
      } else {
        router.push('/patron/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const patronBenefits = [
    {
      icon: Users,
      title: 'All Your Creators in One Place',
      description: 'No more hunting through Discord, Patreon, and YouTube. Everything organized beautifully.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      title: 'Never Lose Your Place',
      description: 'Automatic progress tracking across all devices. Pick up right where you left off.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Film,
      title: 'Find Content Instantly',
      description: 'Smart search and organization by show, season, and episode. Just like Netflix.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your subscription data is encrypted and never shared',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const stats = [
    { label: 'Active Creators', value: '500+', icon: Users },
    { label: 'Hours Watched', value: '2.5M+', icon: Clock },
    { label: 'Happy Patrons', value: '50K+', icon: Heart },
    { label: 'Videos Available', value: '100K+', icon: Film }
  ];

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Patron',
      content: 'Finally, a way to watch all my favorite reaction channels like a proper streaming service! The organization is perfect.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Sarah Martinez',
      role: 'Creator',
      content: 'My patrons love the premium experience. Views have increased 3x since joining ReeActor.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'Mike Johnson',
      role: 'Patron',
      content: 'Continue watching across devices is a game-changer. Worth every penny of my creator support.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-purple-900 animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>



      {/* Hero Section with Image Background */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero/cinema-experience.jpg"
            alt="Cinema Experience"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto mobile-padding text-center animate-fade-in">
          <div className="mb-4 sm:mb-6 inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-red-600/20 border border-red-600/50 rounded-full glass">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-red-300" />
            <span className="text-xs sm:text-sm text-red-300">Streaming Hub for Creator Reactions</span>
          </div>

          <h1 className="heading-h1 mb-6">
            <span className="heading-gradient">Your Creator Content</span>
            <br />
            <span className="text-white animate-slide-up">Streaming Experience</span>
          </h1>

          <p className="body-large text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up mobile-padding" style={{ animationDelay: '0.2s' }}>
            Watch all your favorite reaction creators in one beautiful platform.
            Automatically organized into series, with progress tracking across all devices.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-scale-in mobile-padding" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => router.push('/auth/signup')}
              className="group btn-mobile-lg bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center"
            >
              <span className="hidden sm:inline">Start Watching Free</span>
              <span className="sm:hidden">Start Watching</span>
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/creator/onboarding')}
              className="btn-mobile-lg glass text-white rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              I'm a Creator
            </button>
          </div>

          {/* Live Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass p-4 sm:p-6 rounded-xl animate-fade-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-red-400 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold heading-gradient">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-8 w-8 rotate-90 text-white/50" />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-h2 mb-4 heading-gradient">How It Works</h2>
            <p className="body-large text-gray-400">Get started in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-500 mb-6 relative">
                <span className="text-3xl font-bold text-white">1</span>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <h3 className="heading-h3 mb-3">Connect with Patreon</h3>
              <p className="body-text text-gray-400">
                Sign up and connect your Patreon account. We'll automatically sync your subscriptions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 relative">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="heading-h3 mb-3">Browse Your Content</h3>
              <p className="body-text text-gray-400">
                All your supported creators' content organized in one beautiful interface, automatically sorted into series.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 relative">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="heading-h3 mb-3">Watch & Enjoy</h3>
              <p className="body-text text-gray-400">
                Stream with progress tracking, continue watching across devices, and never miss an episode.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 text-lg"
            >
              Get Started Free
            </button>
            <p className="text-sm text-gray-500 mt-4">No credit card required • Always free</p>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-h2 mb-4 heading-gradient">See It In Action</h2>
            <p className="body-large text-gray-400">Experience the future of reaction content</p>
          </div>
          <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl relative group card-hover">
            <img
              src="/images/hero/streaming-setup.jpg"
              alt="Streaming Setup"
              className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="p-6 bg-red-600/90 backdrop-blur rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 animate-glow-box">
                <Play className="h-12 w-12 text-white" fill="white" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
              <p className="text-white font-semibold">Watch the 2-minute demo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features with Hover Effects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0">
          <img
            src="/images/backgrounds/gradient-red.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-h2 mb-4">Everything You Need</h2>
            <p className="body-large text-gray-400">A premium viewing experience for creator subscription content</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {patronBenefits.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
                  style={{ background: `linear-gradient(135deg, ${feature.color.split(' ')[1].replace('to-', '')}, ${feature.color.split(' ')[0].replace('from-', '')})` }}
                ></div>
                <div className="p-6 sm:p-8 glass-dark rounded-xl transition-all duration-300 group-hover:translate-y-[-4px] group-hover:bg-white/10">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="heading-h4 mb-2">{feature.title}</h3>
                  <p className="body-text text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with Glass Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-h2 mb-4">Loved by Thousands</h2>
            <p className="body-large text-gray-400">Join creators and patrons who've upgraded their experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 glass-dark rounded-xl card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="body-text text-gray-300 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Background Image */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0">
          <img
            src="/images/backgrounds/dark-cinema.jpg"
            alt="Cinema"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-600/20 border border-green-600/50 rounded-full glass mb-6">
            <Zap className="h-4 w-4 mr-2 text-green-400" />
            <span className="text-sm text-green-400">Always Free</span>
          </div>
          <h2 className="heading-h2 mb-6">
            Ready to Transform Your
            <br />
            <span className="heading-gradient">Creator Experience?</span>
          </h2>
          <p className="body-large text-gray-300 mb-8">
            Join ReeActor today and never miss an episode again
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/signup')}
              className="group px-8 py-4 bg-white text-black font-bold rounded-full hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 text-lg flex items-center justify-center"
            >
              <span>Get Started Free</span>
              <Sparkles className="ml-2 h-5 w-5 text-yellow-500" />
            </button>
            <button
              onClick={() => router.push('/creator/onboarding')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 text-lg"
            >
              Creator? Start Here
            </button>
          </div>
          <div className="mt-8 flex justify-center space-x-8 text-sm">
            <div className="flex items-center text-green-400">
              <Check className="h-5 w-5 mr-2" />
              Free Forever
            </div>
            <div className="flex items-center text-green-400">
              <Check className="h-5 w-5 mr-2" />
              No Credit Card
            </div>
            <div className="flex items-center text-green-400">
              <Check className="h-5 w-5 mr-2" />
              Instant Access
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-4">ReeActor</h3>
              <p className="text-gray-400 text-sm">
                The premium platform for creator reaction content.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {/* <li><Link href="/features" className="hover:text-white transition">Features</Link></li> */}
                {/* <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li> */}
                <li><Link href="/creators" className="hover:text-white transition">For Creators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                {/* <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li> */}
                {/* <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li> */}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 ReeActor. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Globe className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition" />
              <Heart className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition" />
              <BarChart3 className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}