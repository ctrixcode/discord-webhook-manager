import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using Discord Webhook Manager, you accept and
                agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use our service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Discord Webhook Manager provides a platform for managing Discord
                webhooks, creating message templates, and sending messages to
                Discord servers. We reserve the right to modify, suspend, or
                discontinue any part of the service at any time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>To use our service, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 13 years old</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>4. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Send spam, malware, or malicious content</li>
                <li>
                  Violate Discord's Terms of Service or Community Guidelines
                </li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Impersonate others or provide false information</li>
                <li>Abuse rate limits or attempt to overload our servers</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>5. Subscription and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Paid subscriptions are billed in advance on a monthly basis. You
                authorize us to charge your payment method for all fees.
                Subscriptions automatically renew unless cancelled before the
                renewal date.
              </p>
              <p>
                We reserve the right to change our pricing with 30 days notice.
                No refunds are provided for partial months or unused services.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>6. Usage Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your account is subject to usage limits based on your
                subscription plan. Exceeding these limits may result in service
                interruption or additional charges. We reserve the right to
                enforce fair use policies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                All content, features, and functionality of Discord Webhook
                Manager are owned by us and protected by copyright, trademark,
                and other intellectual property laws. You retain ownership of
                content you create using our service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>8. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may terminate or suspend your account immediately, without
                prior notice, for conduct that violates these Terms or is
                harmful to other users, us, or third parties. You may cancel
                your account at any time through your account settings.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>9. Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The service is provided "as is" without warranties of any kind.
                We do not guarantee that the service will be uninterrupted,
                secure, or error-free. Use of the service is at your own risk.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>10. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages resulting from your use of or
                inability to use the service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>11. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. We will
                notify users of significant changes via email or through the
                service. Continued use after changes constitutes acceptance of
                the new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>12. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li>
                  Email:{' '}
                  <a
                    href="mailto:legal@example.com"
                    className="text-primary hover:underline"
                  >
                    legal@example.com
                  </a>
                </li>
                <li>
                  Twitter:{' '}
                  <a
                    href="https://twitter.com"
                    className="text-primary hover:underline"
                  >
                    @DiscordWebhookMgr
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
