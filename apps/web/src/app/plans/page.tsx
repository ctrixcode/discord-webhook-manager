'use client';
import React from 'react';
import { Gem, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/constants';

interface PlanFeatureProps {
  text: string;
  available: boolean;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ text, available }) => (
  <div className="flex items-center gap-2 text-sm">
    <CheckCircle2
      className={`h-4 w-4 ${available ? 'text-success' : 'text-muted-foreground'}`}
    />
    <span
      className={
        available ? 'text-foreground' : 'text-muted-foreground line-through'
      }
    >
      {text}
    </span>
  </div>
);

export default function PlansPage() {
  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      price: '€0',
      features: [
        { text: '15 Webhook Messages/Day', available: true },
        { text: '15 MB Media Storage', available: true },
        { text: 'Custom Avatars', available: true },
        { text: 'Priority Support', available: false },
      ],
      cta: 'Get Started',
      ctaLink: '/signup',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      popular: false,
    },
    {
      name: 'Paid',
      description: 'For growing communities',
      price: '€4.99/month',
      features: [
        { text: '50 Webhook Messages/Day', available: true },
        { text: '50 MB Media Storage', available: true },
        { text: 'Priority Support', available: true },
        { text: 'Custom Avatars', available: true },
      ],
      cta: 'Upgrade',
      ctaLink: '#',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      popular: true,
    },
    {
      name: 'Premium',
      description: 'Unleash full power',
      price: '€14.99/month',
      features: [
        { text: 'Unlimited Webhook Messages/Day', available: true },
        { text: '1 GB Media Storage', available: true },
        { text: '24/7 Dedicated Support', available: true },
        { text: 'Custom Avatars', available: true },
      ],
      cta: 'Upgrade',
      ctaLink: '#',
      badgeClass:
        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-lg shadow-yellow-500/20',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Subscription Plans
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that best fits your needs
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <Card
              key={plan.name}
              className={`bg-card/50 backdrop-blur-xl border-border relative ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Gem className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </p>
                    <Badge
                      className={`mt-2 text-sm px-3 py-1 ${plan.badgeClass}`}
                    >
                      {plan.name.toUpperCase()}
                    </Badge>
                  </div>

                  <ul className="space-y-3 flex-grow mb-6">
                    {plan.features.map(feature => (
                      <PlanFeature
                        key={feature.text}
                        text={feature.text}
                        available={feature.available}
                      />
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={
                      plan.popular
                        ? 'w-full bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'w-full'
                    }
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link href={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <Card className="mt-12 bg-card/50 backdrop-blur-xl border-border">
          <CardHeader>
            <CardTitle>Need Help Choosing?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              All plans include access to our core features including webhook
              management, message templates, custom avatars, and embed builder.
              Upgrade anytime to unlock higher limits and priority support.
            </p>
            <p>
              Have questions? Contact us on{' '}
              <a
                href={SOCIAL_LINKS.DISCORD}
                className="text-primary hover:underline"
              >
                Discord
              </a>{' '}
              or{' '}
              <a
                href={SOCIAL_LINKS.TWITTER}
                className="text-primary hover:underline"
              >
                X
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
