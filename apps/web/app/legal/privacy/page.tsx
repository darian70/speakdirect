export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Privacy Policy</h1>
      <p><em>Last updated: 2025-08-18</em></p>
      <p>
        We collect user-submitted contact details and product usage analytics, subject to explicit consent. We do not sell personal data.
        You can request deletion at any time.
      </p>
      <h3>Data we collect</h3>
      <ul>
        <li>name, email, company</li>
        <li>usage events (post-consent)</li>
      </ul>
      <h3>Purpose</h3>
      <p>product improvement, support, sales follow-up</p>
      <h3>Processors</h3>
      <ul>
        <li>PostHog (analytics)</li>
        <li>Postmark/SendGrid (email)</li>
        <li>HubSpot (CRM)</li>
        <li>Intercom (helpdesk)</li>
      </ul>
      <h3>Retention</h3>
      <p>until account deletion or as required by law</p>
      <h3>Security</h3>
      <p>encryption in transit; least privilege access</p>
      <h3>Rights</h3>
      <p>access, correction, deletion, portability</p>
      <h3>Contact</h3>
      <p>SpeakDirectSales@gmail.com</p>
    </main>
  );
}
