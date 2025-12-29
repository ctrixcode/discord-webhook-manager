import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';

export default function RoadmapPage() {
  const roadmapItems = [
    {
      status: 'completed',
      title: 'Core Features',
      items: [
        'Webhook management and testing',
        'Rich message composer with markdown',
        'Custom embeds builder',
        'Message templates',
        'Avatar profiles',
        'Media upload support',
        'Discord OAuth integration',
        'Usage tracking and limits',
      ],
    },
    {
      status: 'in-progress',
      title: 'Current Development',
      items: [
        'Webhook analytics dashboard',
        'Template variables system',
        'Dark/Light theme improvements',
      ],
    },
    {
      status: 'planned',
      title: 'Q1 2026',
      items: [
        'Webhook folders and organization',
        'Team collaboration features',
        'Message A/B testing',
        'Webhook performance metrics',
        'Scheduled messages',
      ],
    },
    {
      status: 'future',
      title: 'Q2 2026 & Beyond',
      items: [
        'Message history and logs',
        'Webhook automation workflows',
        'Advanced role-based permissions',
        'Webhook backup and restore',
        'Multi-language support',
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'in-progress':
        return <Zap className="w-5 h-5 text-primary" />;
      case 'planned':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'future':
        return <Sparkles className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            Completed
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            In Progress
          </Badge>
        );
      case 'planned':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            Planned
          </Badge>
        );
      case 'future':
        return (
          <Badge className="bg-muted text-muted-foreground border-border">
            Future
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Product Roadmap
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our vision for the future of Discord Webhook Manager. See what we've
            built and what's coming next.
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-8">
          {roadmapItems.map((section, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur-xl border-border"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    {getStatusIcon(section.status)}
                    {section.title}
                  </CardTitle>
                  {getStatusBadge(section.status)}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          section.status === 'completed'
                            ? 'text-success'
                            : 'text-muted-foreground/50'
                        }`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Feedback */}
        <Card className="mt-12 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-border">
          <CardHeader>
            <CardTitle>Have a Feature Request?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We love hearing from our community! Your feedback helps shape the
              future of Discord Webhook Manager.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/ctrixcode/discord-webhook-manager/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Submit on GitHub →
              </a>
              <a
                href="https://discord.gg/your-server"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Join our Discord →
              </a>
              <a
                href="https://x.com/Ctrix_Dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Follow on X →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="mt-8 p-6 rounded-lg bg-muted/30 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Status Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-muted-foreground">Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Future</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
