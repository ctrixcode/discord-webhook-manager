'use client';
import React from 'react';
import { Gem, CheckCircle2 } from 'lucide-react';
import { SettingsCard } from '@/components/settings/settings-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PlanFeatureProps {
  text: string;
  available: boolean;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ text, available }) => (
  <div className="flex items-center gap-2 text-sm">
    <CheckCircle2
      className={`h-4 w-4 ${available ? 'text-green-500' : 'text-gray-500'}`}
    />
    <span
      className={available ? 'text-slate-300' : 'text-slate-500 line-through'}
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
        // { text: '5 Webhooks', available: true },
        // { text: 'Basic Analytics', available: true },
        { text: 'Custom Avatars', available: true },
        { text: 'Priority Support', available: false },
      ],
      cta: 'Current Plan',
      ctaLink: '#',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      name: 'Paid',
      description: 'For growing communities',
      price: '€4.99/month',
      features: [
        { text: '50 Webhook Messages/Day', available: true },
        { text: '50 MB Media Storage', available: true },
        // { text: '50 Webhooks', available: true },
        // { text: 'Advanced Analytics', available: true },
        { text: 'Priority Support', available: true },
        { text: 'Custom Avatars', available: true },
      ],
      cta: 'Upgrade',
      ctaLink: '#',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      name: 'Premium',
      description: 'Unleash full power',
      price: '€14.99/month',
      features: [
        { text: 'Unlimited Webhook Messages/Day', available: true },
        { text: '1 GB Media Storage', available: true },
        // { text: 'Unlimited Webhooks', available: true },
        // { text: 'Real-time Analytics', available: true },
        { text: '24/7 Dedicated Support', available: true },
        { text: 'Custom Avatars', available: true },
      ],
      cta: 'Upgrade',
      ctaLink: '#',
      badgeClass:
        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-lg shadow-yellow-500/20',
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Subscription Plans
        </h2>
        <p className="text-slate-300">
          Choose the plan that best fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map(plan => (
          <SettingsCard
            key={plan.name}
            title={plan.name}
            description={plan.description}
            icon={<Gem className="h-5 w-5" />}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <p className="text-4xl font-bold text-white">{plan.price}</p>
                <Badge
                  className={`mt-2 text-sm px-3 py-1 font-semibold ${plan.badgeClass}`}
                >
                  {plan.name.toUpperCase()}
                </Badge>
              </div>

              <ul className="space-y-2 text-slate-400 flex-grow">
                {plan.features.map((feature, index) => (
                  <PlanFeature
                    key={index}
                    text={feature.text}
                    available={feature.available}
                  />
                ))}
              </ul>

              <div className="mt-6">
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Link href={plan.ctaLink}>{plan.cta}</Link>
                </Button>
              </div>
            </div>
          </SettingsCard>
        ))}
      </div>
    </div>
  );
}
