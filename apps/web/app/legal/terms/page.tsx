export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Terms of Service</h1>
      <p style={{opacity:.8}}>Effective: {new Date().getFullYear()}</p>

      <p>
        These Terms of Service (the "Terms") govern your access to and use of OmniAgents products,
        websites, and services (the "Services"). By using the Services, you agree to these Terms.
        If you are using the Services on behalf of an organization, you represent that you have authority
        to bind that organization to these Terms.
      </p>

      <h2>1. Accounts & Eligibility</h2>
      <p>
        You must provide accurate information and maintain the security of your account. You are
        responsible for all activities that occur under your account.
      </p>

      <h2>2. Fees & Payment</h2>
      <p>
        Fees are invoiced as specified in an order form or pricing page. Unless otherwise stated, all
        fees are non-refundable. You authorize us to charge you for all applicable fees using your
        selected payment method.
      </p>

      <h2>3. Customer Data & Privacy</h2>
      <p>
        "Customer Data" means information submitted to or collected by the Services from you or on your
        behalf. You retain ownership of Customer Data. Our use of Customer Data is governed by our
        <a href="/legal/privacy"> Privacy Policy</a> and, if applicable, a
        <a href="/legal/dpa"> Data Processing Addendum</a>.
      </p>

      <h2>4. Security</h2>
      <p>
        We implement reasonable technical and organizational measures designed to protect Customer Data.
        You are responsible for securing your accounts, endpoints, and access credentials.
      </p>

      <h2>5. Availability & Support</h2>
      <p>
        We aim to provide highly available Services. If your plan includes an uptime commitment, those details
        are provided in your order form or written agreement.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>
        You must comply with our <a href="/legal/aup">Acceptable Use Policy</a>. You may not misuse
        the Services or attempt to access them using a method other than the interfaces and instructions
        we provide.
      </p>

      <h2>7. Third‑Party Services</h2>
      <p>
        Integrations and third‑party services are provided by their respective providers and are subject
        to each provider’s terms. We are not responsible for third‑party services.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        We and our licensors retain all rights, title, and interest in and to the Services, including
        all related intellectual property. You grant us a limited license to use your trademarks and
        logos solely to indicate you as a customer, unless you opt out in writing.
      </p>

      <h2>9. Feedback</h2>
      <p>
        If you provide feedback, you grant us a non‑exclusive, perpetual, irrevocable, royalty‑free
        license to use it without restriction.
      </p>

      <h2>10. Confidentiality</h2>
      <p>
        Each party may receive confidential information from the other. The receiving party will use
        reasonable care and only use the confidential information as necessary to perform under these
        Terms.
      </p>

      <h2>11. Term & Termination</h2>
      <p>
        These Terms remain in effect until terminated. We may suspend or terminate access for material
        breach. Upon termination, your right to use the Services ends, but provisions intended to survive
        will survive.
      </p>

      <h2>12. Disclaimers</h2>
      <p>
        THE SERVICES ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR
        STATUTORY.
      </p>

      <h2>13. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You will defend and indemnify us from claims arising out of your use of the Services in violation
        of these Terms or applicable law.
      </p>

      <h2>15. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction specified in your order form or, if none,
        the laws of the State of California, excluding its conflicts of laws rules.
      </p>

      <h2>16. Changes</h2>
      <p>
        We may modify these Terms from time to time. We will post updates to this page with a revised
        effective date. If changes are material, we will provide additional notice as required by law.
      </p>

      <h2>17. Contact</h2>
      <p>
        Questions? Contact us at SpeakDirectSales@gmail.com.
      </p>
    </main>
  );
}
