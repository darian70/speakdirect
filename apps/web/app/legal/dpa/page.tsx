export const metadata = { title: "Data Processing Addendum" };

export default function DPAPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Data Processing Addendum</h1>
      <p style={{opacity:.8}}>Effective: {new Date().getFullYear()}</p>

      <p>
        This Data Processing Addendum ("DPA") forms part of the agreement between OmniAgents ("Processor")
        and the customer ("Controller"). Capitalized terms not defined here have the meaning in the
        Agreement or applicable data protection laws.
      </p>

      <h2>1. Scope & Roles</h2>
      <p>
        Controller instructs Processor to process personal data to provide the Services. Processor acts as
        a processor (or service provider) and will process personal data only on documented instructions
        from Controller.
      </p>

      <h2>2. Processing Details</h2>
      <ul>
        <li>Subject Matter: Provision of the Services.</li>
        <li>Duration: For the term of the Agreement and as required by law.</li>
        <li>Nature & Purpose: Hosting, storage, transmission, and AI‑assisted processing.</li>
        <li>Types of Data: Contact information, communications content, and metadata, as submitted by Controller.</li>
        <li>Data Subjects: Personnel, customers, end‑users, and other individuals as designated by Controller.</li>
      </ul>

      <h2>3. Security</h2>
      <p>
        Processor implements appropriate technical and organizational measures to protect personal data,
        including access controls, encryption in transit, and regular vulnerability management.
      </p>

      <h2>4. Subprocessors</h2>
      <p>
        Controller authorizes Processor to engage subprocessors to support the Services. Processor will
        impose data protection obligations on subprocessors and remain responsible for their performance.
        A current list of subprocessors is available upon request.
      </p>

      <h2>5. International Transfers</h2>
      <p>
        Where personal data is transferred internationally, Processor will ensure appropriate safeguards
        (e.g., Standard Contractual Clauses) or rely on an adequacy decision, as applicable.
      </p>

      <h2>6. Data Subject Requests</h2>
      <p>
        Taking into account the nature of processing, Processor will assist Controller in responding to
        requests to exercise data subject rights under applicable laws.
      </p>

      <h2>7. Incident Response</h2>
      <p>
        Processor will notify Controller without undue delay after becoming aware of a personal data breach
        affecting Controller data and will provide information as it becomes available, consistent with
        legal requirements and security needs.
      </p>

      <h2>8. Audits</h2>
      <p>
        Upon request and subject to confidentiality, Processor will provide relevant information to
        demonstrate compliance with this DPA and allow for audits, including inspections, conducted by
        Controller or an auditor mandated by Controller.
      </p>

      <h2>9. Deletion or Return</h2>
      <p>
        Upon termination or expiry of the Services, Processor will delete or return personal data in its
        possession, unless retention is required by law.
      </p>

      <h2>10. Miscellaneous</h2>
      <p>
        This DPA prevails over any conflicting terms in the Agreement. If any provision is held invalid,
        the remainder remains in effect.
      </p>
    </main>
  );
}
