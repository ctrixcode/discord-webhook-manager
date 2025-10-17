'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Webhook, Clock, FileText, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="min-h-screen">
      <div className="space-y-8 p-6">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('welcome')}
          </h2>
          <p className="text-slate-300 text-lg">{t('manage')}</p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-purple-400" />
              {t('quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/dashboard/webhooks">
                <Button
                  className="w-full h-24 flex-col gap-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:from-purple-600/30 hover:to-pink-600/30 hover:border-purple-400/50 transition-all duration-300 text-white"
                  variant="outline"
                >
                  <Webhook className="w-8 h-8 text-purple-400" />
                  <span className="font-medium">{t('webhook')}</span>
                </Button>
              </Link>

              <Link href="/dashboard/send">
                <Button
                  className="w-full h-24 flex-col gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 hover:from-blue-600/30 hover:to-purple-600/30 hover:border-blue-400/50 transition-all duration-300 text-white"
                  variant="outline"
                >
                  <Clock className="w-8 h-8 text-blue-400" />
                  <span className="font-medium">{t('sendMessage')}</span>
                </Button>
              </Link>

              <Link href="/dashboard/templates">
                <Button
                  className="w-full h-24 flex-col gap-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-pink-500/30 hover:from-pink-600/30 hover:to-purple-600/30 hover:border-pink-400/50 transition-all duration-300 text-white"
                  variant="outline"
                >
                  <FileText className="w-8 h-8 text-pink-400" />
                  <span className="font-medium">{t('template')}</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">{t('gettingStarted')}</CardTitle>
            <p className="text-slate-300">{t('gettingStartedDesc')}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Step
                number="1"
                title={t('steps.oneTitle')}
                description={t('steps.oneDesc')}
                color="from-purple-500 to-pink-500"
              />
              <Step
                number="2"
                title={t('steps.twoTitle')}
                description={t('steps.twoDesc')}
                color="from-blue-500 to-purple-500"
              />
              <Step
                number="3"
                title={t('steps.threeTitle')}
                description={t('steps.threeDesc')}
                color="from-pink-500 to-purple-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Step({ number, title, description, color }: any) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} text-white flex items-center justify-center text-sm font-bold shadow-lg`}
      >
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-slate-300">{description}</p>
      </div>
    </div>
  );
}
