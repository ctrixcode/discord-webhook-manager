import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Webhook,
  Send,
  FileText,
  Zap,
  ArrowRight,
  Plus,
  Activity,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your Discord webhooks and messages efficiently.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Webhooks
            </CardTitle>
            <Webhook className="h-4 w-4 text-discord" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 added this month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">+0.4% improvement</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next in 2h 15m</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/webhooks" className="group">
          <Card className="h-full hover:shadow-lg hover:border-discord/50 transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-discord/10 rounded-xl group-hover:bg-discord/20 transition-colors">
                  <Webhook className="size-6 text-discord" />
                </div>
                <ArrowRight className="size-5 text-muted-foreground group-hover:text-discord group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Manage Webhooks</h3>
              <p className="text-sm text-muted-foreground">
                Create and organize your Discord webhooks
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/send" className="group">
          <Card className="h-full hover:shadow-lg hover:border-purple-500/50 transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <Send className="size-6 text-purple-500" />
                </div>
                <ArrowRight className="size-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Send Message</h3>
              <p className="text-sm text-muted-foreground">
                Compose and send messages instantly
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/templates" className="group">
          <Card className="h-full hover:shadow-lg hover:border-pink-500/50 transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-pink-500/10 rounded-xl group-hover:bg-pink-500/20 transition-colors">
                  <FileText className="size-6 text-pink-500" />
                </div>
                <ArrowRight className="size-5 text-muted-foreground group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Templates</h3>
              <p className="text-sm text-muted-foreground">
                Design and manage message templates
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-blue-500" />
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: 'Message sent',
                  target: '#announcements',
                  time: '2 mins ago',
                  icon: Send,
                  color: 'text-purple-500',
                  bg: 'bg-purple-500/10',
                },
                {
                  action: 'Webhook created',
                  target: 'Marketing Updates',
                  time: '1 hour ago',
                  icon: Webhook,
                  color: 'text-discord',
                  bg: 'bg-discord/10',
                },
                {
                  action: 'Template updated',
                  target: 'Weekly Newsletter',
                  time: '3 hours ago',
                  icon: FileText,
                  color: 'text-pink-500',
                  bg: 'bg-pink-500/10',
                },
                {
                  action: 'Message scheduled',
                  target: '#general',
                  time: '5 hours ago',
                  icon: Clock,
                  color: 'text-orange-500',
                  bg: 'bg-orange-500/10',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.bg}`}>
                      <item.icon className={`size-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.target}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Section */}
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm h-fit">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-yellow-500" />
              <CardTitle className="text-lg">Getting Started</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative pl-6 border-l-2 border-muted">
                <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-background border-2 border-discord" />
                <h4 className="font-semibold mb-1 text-sm text-foreground">
                  1. Connect Webhook
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Add a Discord webhook URL.
                </p>
                <Link href="/dashboard/webhooks">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs w-full"
                  >
                    <Plus className="size-3 mr-1.5" />
                    Add Webhook
                  </Button>
                </Link>
              </div>

              <div className="relative pl-6 border-l-2 border-muted">
                <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-background border-2 border-purple-500" />
                <h4 className="font-semibold mb-1 text-sm text-foreground">
                  2. Send Message
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Test your webhook.
                </p>
                <Link href="/dashboard/send">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs w-full"
                  >
                    <Send className="size-3 mr-1.5" />
                    Compose
                  </Button>
                </Link>
              </div>

              <div className="relative pl-6 border-l-2 border-muted">
                <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-background border-2 border-pink-500" />
                <h4 className="font-semibold mb-1 text-sm text-foreground">
                  3. Create Template
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Save designs for later.
                </p>
                <Link href="/dashboard/templates">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs w-full"
                  >
                    <FileText className="size-3 mr-1.5" />
                    New Template
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
