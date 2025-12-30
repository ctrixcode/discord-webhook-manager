import {
  Webhook,
  MessageSquare,
  Palette,
  FileText,
  Users,
  Image,
  Code,
  Zap,
  Shield,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export default function FeaturesPage() {
  const features = [
    {
      icon: Webhook,
      title: 'Webhook Management',
      description:
        'Create, organize, and manage multiple Discord webhooks from a centralized dashboard. Test webhooks instantly to verify functionality.',
    },
    {
      icon: MessageSquare,
      title: 'Rich Message Composer',
      description:
        'Craft messages with markdown formatting, mentions, emojis, and custom styling. Live preview shows exactly how your message will appear.',
    },
    {
      icon: Palette,
      title: 'Custom Embeds',
      description:
        'Design beautiful embeds with custom colors, titles, descriptions, fields, images, thumbnails, and footers with real-time preview.',
    },
    {
      icon: FileText,
      title: 'Message Templates',
      description:
        'Save frequently used messages as reusable templates. Quickly send announcements, updates, or notifications without rewriting content.',
    },
    {
      icon: Users,
      title: 'Avatar Profiles',
      description:
        'Create and manage reusable avatar profiles with custom usernames and images. Switch between different personas effortlessly.',
    },
    {
      icon: Image,
      title: 'Media Upload',
      description:
        'Upload and attach images directly to webhook messages. Supports various image formats with instant preview functionality.',
    },
    {
      icon: Code,
      title: 'Variable System',
      description:
        'Use dynamic variables in messages and templates. Automatically insert dates, times, and custom placeholders when sending.',
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      description:
        'Send messages to Discord instantly with optimized delivery. Real-time feedback on message status and delivery confirmation.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        'Webhook URLs and data are encrypted and stored securely. OAuth integration with Discord ensures safe authentication.',
    },
    {
      icon: Clock,
      title: 'Usage Tracking',
      description:
        'Monitor webhook usage, message counts, and storage limits. Real-time statistics help you stay within plan limits.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Features</h1>
          <p className="text-muted-foreground">
            Comprehensive tools for managing Discord webhooks
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-xl border-border"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="mt-8 bg-card/50 backdrop-blur-xl border-border">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Discord Webhook Manager provides a complete solution for managing
              your Discord webhooks. Whether you're sending announcements,
              updates, or automated notifications, our platform makes it simple
              and efficient.
            </p>
            <p>
              All features are designed to work seamlessly together, allowing
              you to create professional-looking messages without any coding
              knowledge. The intuitive interface ensures you can get started
              immediately.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
