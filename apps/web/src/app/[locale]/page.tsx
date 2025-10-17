import React from 'react';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('meta');
  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'Discord',
      'Webhook',
      'Manager',
      'Automation',
      'Messages',
      'Bots',
      'Communication',
      'Tools',
    ],
  };
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken');
  const isLoggedIn = !!refreshToken;

  const t = await getTranslations('home');

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen p-4 md:p-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
          {t('hero.heading')}
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-4xl leading-relaxed opacity-90">
          {t('hero.subtext')}
        </p>
        <a
          href={isLoggedIn ? '/dashboard' : '/login'}
          className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out shadow-xl transform hover:scale-105"
        >
          {isLoggedIn
            ? t('hero.button_logged_in')
            : t('hero.button_logged_out')}
        </a>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 md:px-24 bg-slate-800 bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 drop-shadow-md">
            {t('whatWeDo.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              'centralized',
              'richMessages',
              'customAvatars',
              'ui',
              'secure',
            ].map(key => (
              <div
                key={key}
                className="bg-slate-700 bg-opacity-70 p-8 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {t(`whatWeDo.features.${key}.title`)}
                </h3>
                <p className="text-lg opacity-80">
                  {t(`whatWeDo.features.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-4 md:px-24 bg-slate-900 bg-opacity-70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 drop-shadow-md">
            {t('contact.title')}
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {t('contact.desc')}
          </p>

          <div className="flex flex-col items-center space-y-4">
            <a
              href={`mailto:${t('contact.email')}`}
              className="inline-flex items-center text-lg md:text-xl text-indigo-400 hover:text-indigo-300 transition duration-300 ease-in-out"
            >
              📧 {t('contact.email')}
            </a>

            <a
              href="https://github.com/ctrixcode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-lg md:text-xl text-indigo-400 hover:text-indigo-300 transition duration-300 ease-in-out"
            >
              🐙 {t('contact.github')}
            </a>

            <a
              href="https://ctrix.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-lg md:text-xl text-indigo-400 hover:text-indigo-300 transition duration-300 ease-in-out"
            >
              🌐 {t('contact.portfolio')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-4 md:px-24 bg-slate-900 bg-opacity-90 text-center text-sm opacity-70">
        <p>
          © {new Date().getFullYear()} {t('footer.copyright')}
        </p>
      </footer>
    </div>
  );
}
