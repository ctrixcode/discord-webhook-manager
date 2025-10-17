'use client';
import React from 'react';
import { Gem, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl'; // Import useTranslations
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
  const t = useTranslations('dashboard.plansPage');
  const tPlan = useTranslations('dashboard.plansPage.plans'); // Helper for nested path

  // Define the plans data structure using translation keys
  const plans = [
    {
      key: 'free', // Use a key for dynamic translation lookup
      price: '€0',
      features: [
        { textKey: 'free.features.messages_day', count: 15, available: true },
        { textKey: 'free.features.media_storage', count: 15, available: true },
        { textKey: 'free.features.custom_avatars', available: true },
        { textKey: 'free.features.priority_support', available: false },
      ],
      ctaKey: 'free.cta_current',
      ctaLink: '#',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      key: 'paid',
      price: '€4.99/month',
      features: [
        { textKey: 'free.features.messages_day', count: 50, available: true },
        { textKey: 'free.features.media_storage', count: 50, available: true },
        { textKey: 'free.features.priority_support', available: true },
        { textKey: 'free.features.custom_avatars', available: true },
      ],
      ctaKey: 'paid.cta_upgrade',
      ctaLink: '#',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      key: 'premium',
      price: '€14.99/month',
      features: [
        { textKey: 'free.features.unlimited_messages', available: true },
        { textKey: 'free.features.large_storage', count: 1, available: true },
        { textKey: 'free.features.dedicated_support', available: true },
        { textKey: 'free.features.custom_avatars', available: true },
      ],
      ctaKey: 'premium.cta_upgrade',
      ctaLink: '#',
      badgeClass:
        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-lg shadow-yellow-500/20',
    },
  ];

  // Helper function to render a feature text using the translation key and count
  const renderFeatureText = (feature: any) => {
    // The feature text is determined by looking up the key and applying the count placeholder if it exists.
    if (feature.count !== undefined) {
      // We use tPlan since the keys start from 'plansPage.plans.free.features'
      return tPlan(feature.textKey, { count: feature.count });
    }
    return tPlan(feature.textKey);
  };

  return (
    <div className="min-h-screen p-6">
      <div>
        {/* Translate Title */}
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {t('title')}
        </h2>
        {/* Translate Subtitle */}
        <p className="text-slate-300">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map(plan => (
          <SettingsCard
            key={plan.key}
            // Translate Name
            title={tPlan(`${plan.key}.name`)}
            // Translate Description
            description={tPlan(`${plan.key}.description`)}
            icon={<Gem className="h-5 w-5" />}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <p className="text-4xl font-bold text-white">{plan.price}</p>
                <Badge
                  className={`mt-2 text-sm px-3 py-1 font-semibold ${plan.badgeClass}`}
                >
                  {/* Translate and uppercase Name */}
                  {tPlan(`${plan.key}.name`).toUpperCase()}
                </Badge>
              </div>

              <ul className="space-y-2 text-slate-400 flex-grow">
                {plan.features.map((feature, index) => (
                  <PlanFeature
                    key={index}
                    // Render dynamically translated feature text
                    text={renderFeatureText(feature)}
                    available={feature.available}
                  />
                ))}
              </ul>

              <div className="mt-6">
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {/* Translate CTA */}
                  <Link href={plan.ctaLink}>{tPlan(plan.ctaKey)}</Link>
                </Button>
              </div>
            </div>
          </SettingsCard>
        ))}
      </div>
    </div>
  );
}
