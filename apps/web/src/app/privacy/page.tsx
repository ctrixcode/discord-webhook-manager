import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CONTACT, SOCIAL_LINKS, DEVELOPER } from '@/lib/constants';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 30, 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We collect information you provide directly to us when you
                create an account, use our services, or communicate with us.
                This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (email, username, password)</li>
                <li>Discord account information (if you link your Discord)</li>
                <li>Webhook URLs and configurations</li>
                <li>Message templates and content</li>
                <li>Avatar profiles and uploaded media</li>
                <li>Usage data and analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and deliver webhook messages</li>
                <li>Send you technical notices and support messages</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>3. Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
              <p>
                Your webhook URLs and sensitive data are encrypted both in
                transit and at rest. We use industry-standard security protocols
                to ensure your data remains secure.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>4. Data Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>5. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>6. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar tracking technologies to improve your
                experience. See our{' '}
                <a href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </a>{' '}
                for more details.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>7. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have questions about this Privacy Policy, please contact
                us:
              </p>
              <ul className="list-none space-y-2">
                <li>
                  Email:{' '}
                  <a
                    href={`mailto:${CONTACT.PRIVACY_EMAIL}`}
                    className="text-primary hover:underline"
                  >
                    {CONTACT.PRIVACY_EMAIL}
                  </a>
                </li>
                <li>
                  X:{' '}
                  <a
                    href={SOCIAL_LINKS.TWITTER}
                    className="text-primary hover:underline"
                  >
                    {DEVELOPER.TWITTER_HANDLE}
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
