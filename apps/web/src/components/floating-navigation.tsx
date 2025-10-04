'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DiscordLogo } from '@/components/discord-logo';
import { Webhook, FileText, Settings, X, Users, Send } from 'lucide-react';
import Link from 'next/link';

const navigation = [
  // {
  //   name: 'Home',
  //   href: '/dashboard',
  //   icon: Home,
  //   color: 'bg-blue-500 hover:bg-blue-600',
  // },
  {
    name: 'Webhooks',
    href: '/dashboard/webhooks',
    icon: Webhook,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Send Message',
    href: '/dashboard/send',
    icon: Send,
    color: 'bg-cyan-500 hover:bg-cyan-600',
  },
  // {
  //   name: 'Scheduled',
  //   href: '/dashboard/scheduled',
  //   icon: Clock,
  //   color: 'bg-orange-500 hover:bg-orange-600',
  // },
  {
    name: 'Templates',
    href: '/dashboard/templates',
    icon: FileText,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: 'Avatars',
    href: '/dashboard/avatars',
    icon: Users,
    color: 'bg-pink-500 hover:bg-pink-600',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    color: 'bg-gray-500 hover:bg-gray-600',
  },
];

export function FloatingNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getRadialPosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90; // Start from top (-90 degrees)
    const radius = 100; // Reduced radius for more compact layout
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Navigation */}
      <div
        className={cn(
          'fixed z-50 transition-all duration-500 ease-out',
          isOpen
            ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'bottom-6 right-6'
        )}
      >
        {/* Navigation Items in Radial Pattern */}
        {isOpen && (
          <div className="absolute inset-0">
            {navigation.map((item, index) => {
              const { x, y } = getRadialPosition(index, navigation.length);

              return (
                <div
                  key={item.name}
                  className={cn(
                    'absolute transition-all duration-700 ease-out',
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  )}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    transitionDelay: `${300 + index * 80}ms`,
                  }}
                >
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    <div className="flex flex-col items-center gap-2 group">
                      <Button
                        size="icon"
                        className={cn(
                          'w-14 h-14 rounded-full shadow-xl transition-all duration-300',
                          item.color,
                          'hover:scale-110 active:scale-95'
                        )}
                      >
                        <item.icon className="w-7 h-7 text-white" />
                      </Button>
                      <span className="text-xs font-medium text-white bg-black/60 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <Button
          onClick={toggleMenu}
          size="icon"
          className={cn(
            'w-16 h-16 rounded-full shadow-2xl transition-all duration-500',
            'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
            'hover:scale-110 active:scale-95 relative z-10',
            'flex items-center justify-center', // Added explicit flex centering for perfect icon alignment
            isOpen && 'scale-125 rotate-45'
          )}
        >
          {isOpen ? (
            <Link href={'/dashboard'}>
              <X className="w-7 h-7 text-white transition-all duration-300" />
            </Link>
          ) : (
            <DiscordLogo className="w-7 h-7 text-white transition-all duration-300" />
          )}
        </Button>
      </div>
    </>
  );
}
