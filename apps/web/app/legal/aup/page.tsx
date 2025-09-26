export const metadata = { title: "Acceptable Use Policy" };

export default function AUPPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Acceptable Use Policy</h1>
      <p style={{opacity:.8}}>Effective: {new Date().getFullYear()}</p>

      <p>
        This Acceptable Use Policy ("AUP") describes prohibited conduct when using OmniAgents
        Services. You must ensure that your users and third parties under your control comply with this AUP.
      </p>

      <h2>1. Prohibited Content & Activities</h2>
      <ul>
        <li>Illegal activities, including violation of applicable laws or regulations.</li>
        <li>Infringing, defamatory, deceptive, or harmful content, including malware or spam.</li>
        <li>Abuse, harassment, discrimination, or threats of violence.</li>
        <li>Collection or processing of personal data without a valid legal basis and notice.</li>
        <li>Misuse of AI outputs to deceive, impersonate, or engage in fraud.</li>
      </ul>

      <h2>2. Security & Integrity</h2>
      <ul>
        <li>Do not probe, scan, or test the vulnerability of any system or network without prior written authorization.</li>
        <li>Do not interfere with or disrupt the Services or bypass any access or rate limits.</li>
        <li>Protect credentials, API keys, and tokens. Do not share them publicly.</li>
      </ul>

      <h2>3. Messaging & Telephony</h2>
      <ul>
        <li>Comply with anti‑spam laws (e.g., CAN‑SPAM, TCPA) and carrier policies.</li>
        <li>Obtain proper consent for messaging and honor opt‑out requests.</li>
        <li>Do not send unwanted, deceptive, or abusive communications.</li>
      </ul>

      <h2>4. Data Protection</h2>
      <p>
        You are responsible for complying with privacy and data protection laws applicable to your use.
        Our data practices are described in the <a href="/legal/privacy">Privacy Policy</a> and, where applicable, the
        <a href="/legal/dpa"> Data Processing Addendum</a>.
      </p>

      <h2>5. Enforcement</h2>
      <p>
        We may investigate suspected violations, suspend or terminate access, or remove content to protect
        the Services or comply with legal obligations. We may report unlawful conduct to authorities.
      </p>

      <h2>6. Changes</h2>
      <p>
        We may update this AUP from time to time. Material updates will be communicated as required by law.
      </p>
    </main>
  );
}
