import Link from 'next/link';
import { Webhook, Github, Twitter, Disc } from 'lucide-react';
import { SOCIAL_LINKS, DEVELOPER } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-xl mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-discord flex items-center justify-center">
                <Webhook className="size-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Discord Webhook Manager
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Streamline your Discord announcements with our powerful,
              easy-to-use webhook management platform.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href={SOCIAL_LINKS.GITHUB}
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="size-5" />
              </Link>
              <Link
                href={SOCIAL_LINKS.TWITTER}
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="size-5" />
              </Link>
              <Link
                href={SOCIAL_LINKS.DISCORD}
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Disc className="size-5" />
              </Link>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/plans"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="hover:text-foreground transition-colors"
                >
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="hover:text-foreground transition-colors"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="hover:text-foreground transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-foreground transition-colors"
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Discord Webhook Manager. All rights
            reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> by{' '}
            <Link
              href={SOCIAL_LINKS.GITHUB}
              className="hover:text-foreground transition-colors font-medium"
            >
              {DEVELOPER.NAME}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
