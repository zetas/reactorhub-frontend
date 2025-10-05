'use client';

import { useEffect } from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { Film, Users, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';
import { ContinueWatching } from '@/components/ContinueWatching';

export default function PatronDashboard() {
  const { setBreadcrumbs } = useNavigation();
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  useEffect(() => {
    // Set breadcrumbs for patron dashboard
    setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard', isActive: true }
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="min-h-screen bg-dark-950 text-dark-50">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-dark-950 to-accent-900 animate-pulse" style={{ animationDuration: '8s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto mobile-padding py-8">
        {/* Hero Header */}
        <header className="mb-8 sm:mb-12">
          <div className="mb-4 inline-flex items-center px-4 py-2 bg-primary-500/20 border border-primary-500/50 rounded-full glass">
            <Sparkles className="h-4 w-4 mr-2 text-primary-400" />
            <span className="text-sm text-primary-400">Your Personal Streaming Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="heading-gradient">Welcome Back</span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-300">
            Continue watching your favorite creators' reaction content
          </p>
        </header>

        {/* Quick Stats */}
        <section aria-labelledby="stats-heading" className="mb-8 sm:mb-12">
          <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
          <div className="mobile-grid-4 gap-4 sm:gap-6">
          {[
            { title: "Subscriptions", value: "5", icon: Users, gradient: "from-purple-500 to-pink-500" },
            { title: "Watch Time", value: "24h 30m", icon: Clock, gradient: "from-green-500 to-emerald-500" },
            { title: "Videos Watched", value: "127", icon: Film, gradient: "from-blue-500 to-cyan-500" },
            { title: "Trending", value: "12 new", icon: TrendingUp, gradient: "from-primary-500 to-primary-600" }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard {...stat} />
            </div>
          ))}
          </div>
        </section>

        {/* Content Sections */}
        <div className="space-y-8 sm:space-y-12">

          {/* Continue Watching */}
          <section>
            <ContinueWatching limit={12} />
          </section>

          {/* New from Subscriptions */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-dark-50">New from Your Subscriptions</h2>
            <div className="glass-dark p-8 rounded-2xl card-hover">
              <p className="text-dark-300 text-center py-8 text-lg">
                Subscribe to creators to see their latest content here.
              </p>
            </div>
          </section>

          {/* Trending */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-dark-50">Trending Now</h2>
            <div className="glass-dark p-8 rounded-2xl card-hover">
              <p className="text-dark-300 text-center py-8 text-lg">
                Discover what's popular on ReeActor.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  gradient
}: {
  title: string;
  value: string;
  icon: any;
  gradient: string;
}) {
  return (
    <div className="glass-dark p-6 rounded-xl card-hover group" role="region" aria-labelledby={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} transition-transform duration-200 group-hover:scale-110`} aria-hidden="true">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-3xl sm:text-4xl font-bold heading-gradient mb-1" aria-label={`${title}: ${value}`}>{value}</p>
        <p className="text-sm text-dark-400" id={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</p>
      </div>
    </div>
  );
}