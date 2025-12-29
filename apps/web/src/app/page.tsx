import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Webhook,
  Send,
  MessageSquare,
  User,
  Zap,
  ArrowRight,
  Star,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 transition-colors">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-discord/10 rounded-full text-discord text-sm font-medium mb-6">
            <Sparkles className="size-4" />
            Welcome to Discord Webhook Manager
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            Streamline Your Discord
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-discord to-purple-500">
              Announcements
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Manage webhooks, custom avatars, and message templates without
            writing a single line of code
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard/webhooks">
              <Button
                size="lg"
                className="bg-discord hover:bg-discord-dark rounded-xl text-base"
              >
                Get Started
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard/send">
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl text-base bg-transparent"
              >
                Send Message
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50 backdrop-blur-sm hover:shadow-lg hover:shadow-discord/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-discord/10 rounded-xl">
                <Webhook className="size-6 text-discord" />
              </div>
              <span className="text-xs font-medium text-success px-2.5 py-1 bg-success/10 rounded-full">
                +12%
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Active Webhooks
              </p>
              <p className="text-3xl font-bold text-foreground">24</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Send className="size-6 text-purple-500" />
              </div>
              <span className="text-xs font-medium text-success px-2.5 py-1 bg-success/10 rounded-full">
                +28%
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Messages Sent
              </p>
              <p className="text-3xl font-bold text-foreground">1,248</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50 backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <MessageSquare className="size-6 text-green-500" />
              </div>
              <span className="text-xs font-medium text-muted-foreground px-2.5 py-1 bg-muted/50 rounded-full">
                --
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Templates</p>
              <p className="text-3xl font-bold text-foreground">18</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50 backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <User className="size-6 text-orange-500" />
              </div>
              <span className="text-xs font-medium text-success px-2.5 py-1 bg-success/10 rounded-full">
                +8%
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Custom Avatars
              </p>
              <p className="text-3xl font-bold text-foreground">32</p>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/dashboard/webhooks">
            <Card className="p-6 bg-gradient-to-br from-discord to-discord-dark dark:from-indigo-900 dark:to-indigo-950 text-white border-0 hover:shadow-lg hover:shadow-discord/20 transition-all duration-300 cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <Webhook className="size-6" />
                </div>
                <ArrowRight className="size-5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Manage Webhooks</h3>
              <p className="text-sm text-white/70">
                Create, edit, and organize all your Discord webhooks in one
                place
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/templates">
            <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-900 dark:to-purple-950 text-white border-0 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <MessageSquare className="size-6" />
                </div>
                <ArrowRight className="size-5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Message Templates</h3>
              <p className="text-sm text-white/70">
                Design reusable message templates with rich embeds
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/avatars">
            <Card className="p-6 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-900 dark:to-green-950 text-white border-0 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <User className="size-6" />
                </div>
                <ArrowRight className="size-5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Avatars</h3>
              <p className="text-sm text-white/70">
                Create and manage reusable avatar profiles for webhooks
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/send">
            <Card className="p-6 bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-900 dark:to-orange-950 text-white border-0 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer group h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <Send className="size-6" />
                </div>
                <ArrowRight className="size-5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Send Messages</h3>
              <p className="text-sm text-white/70">
                Compose and send messages with rich formatting options
              </p>
            </Card>
          </Link>

          <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-950 text-white border-0 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                <Shield className="size-6" />
              </div>
              <Star className="size-5 opacity-60" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-sm text-white/70">
              Enterprise-grade security with 98.5% success rate
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-600 to-pink-700 dark:from-pink-900 dark:to-pink-950 text-white border-0 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer group h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                <Zap className="size-6" />
              </div>
              <Sparkles className="size-5 opacity-60" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-white/70">
              Send messages instantly with real-time preview
            </p>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50 backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Activity
                </h2>
                <p className="text-sm text-muted-foreground">
                  Messages sent in the last 7 days
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between h-48 gap-3">
              {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                >
                  <div className="w-full max-w-20 h-full bg-muted/20 rounded-xl relative group cursor-pointer">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-discord to-discord/80 rounded-xl transition-all duration-300 group-hover:to-discord"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-xs font-medium whitespace-nowrap z-10">
                        {Math.floor(height * 2.5)} messages
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact Us */}
          <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-indigo-950 text-white border-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <MessageSquare className="size-6" />
                </div>
                <h2 className="text-lg font-semibold">Need Help?</h2>
              </div>
              <p className="text-white/80 mb-6">
                Join our Discord community for support, feature requests, and to
                connect with other users.
              </p>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 rounded-xl font-semibold">
                <Webhook className="size-4 mr-2" />
                Join Discord Server
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 text-white hover:text-white rounded-xl bg-transparent"
              >
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
