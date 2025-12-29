import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CONTACT, SOCIAL_LINKS, DEVELOPER } from '@/lib/constants';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>1. What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Cookies are small text files that are placed on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and understanding how
                you use our service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>2. How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for the website
                  to function properly (authentication, security)
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences (theme, language)
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors use our website
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Monitor and improve
                  website performance
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>3. Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Session Cookies
                  </h4>
                  <p>
                    Temporary cookies that expire when you close your browser.
                    Used for authentication and maintaining your session.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Persistent Cookies
                  </h4>
                  <p>
                    Remain on your device for a set period or until you delete
                    them. Used to remember your preferences across visits.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Third-Party Cookies
                  </h4>
                  <p>
                    Set by external services we use (analytics, authentication).
                    These are subject to the third party's privacy policy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>4. Specific Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-4 text-foreground">
                        Cookie Name
                      </th>
                      <th className="text-left py-2 px-4 text-foreground">
                        Purpose
                      </th>
                      <th className="text-left py-2 px-4 text-foreground">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-4">accessToken</td>
                      <td className="py-2 px-4">Authentication</td>
                      <td className="py-2 px-4">Session</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-4">refreshToken</td>
                      <td className="py-2 px-4">Session renewal</td>
                      <td className="py-2 px-4">7 days</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-4">theme</td>
                      <td className="py-2 px-4">Theme preference</td>
                      <td className="py-2 px-4">1 year</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-4">_ga</td>
                      <td className="py-2 px-4">Google Analytics</td>
                      <td className="py-2 px-4">2 years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>5. Managing Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>You can control and manage cookies in several ways:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Browser Settings:</strong> Most browsers allow you to
                  refuse or delete cookies through their settings
                </li>
                <li>
                  <strong>Opt-Out Tools:</strong> Use browser extensions or
                  privacy tools to block tracking cookies
                </li>
                <li>
                  <strong>Do Not Track:</strong> Enable "Do Not Track" in your
                  browser preferences
                </li>
              </ul>
              <p className="mt-4">
                Note: Blocking essential cookies may prevent you from using some
                features of our service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>6. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use the following third-party services that may set cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Google Analytics:</strong> Website analytics and usage
                  tracking
                </li>
                <li>
                  <strong>Vercel Analytics:</strong> Performance monitoring
                </li>
                <li>
                  <strong>Discord OAuth:</strong> Authentication services
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>7. Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Cookie Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>8. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you have questions about our use of cookies, please contact
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
                  Twitter:{' '}
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
