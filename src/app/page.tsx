'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DiscordLogo } from '@/components/discord-logo';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleDiscordLogin = () => {
    // Mock Discord OAuth - in production this would redirect to Discord
    const mockUser = {
      id: '123456789012345678',
      username: 'WebhookManager',
      discriminator: '0001',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    };

    login(mockUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <DiscordLogo className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Webhook Manager
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Manage, schedule, and customize your Discord webhooks with ease
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <DiscordLogo className="w-5 h-5 text-primary-foreground" />
                </div>
                Sign in with Discord
              </CardTitle>
              <CardDescription>
                Connect your Discord account to manage webhooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleDiscordLogin} className="w-full" size="lg">
                <DiscordLogo className="w-5 h-5 mr-2" />
                Continue with Discord
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manage Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Store and organize all your Discord webhooks in one place
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schedule Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Plan and schedule webhook messages for future delivery
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create reusable message templates with embeds and formatting
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
