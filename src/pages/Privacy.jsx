import React from "react";

const Privacy = () => {
  return (
    <div className="mx-auto px-8 sm:px-24 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">🔒 Seeb - Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: 01/03/2025</p>

      <Section title="1. Information We Collect">
        We collect different types of information, including:
      </Section>

      <SubSection title="1.1 Personal Information">
        When you register, book a service, or interact with us, we may collect:
        <ul className="list-disc list-inside mt-2">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Address</li>
          <li>Payment information</li>
        </ul>
      </SubSection>

      <SubSection title="1.2 Non-Personal Information">
        We may collect non-identifiable data, such as:
        <ul className="list-disc list-inside mt-2">
          {/* <li>Device information (IP address, browser type, operating system)</li> */}
          <li>Usage data (pages visited, time spent on the website/app)</li>
          <li>Cookies and tracking technologies</li>
        </ul>
      </SubSection>

      <Section title="2. How We Use Your Information">
        We use your information to:
        <ul className="list-disc list-inside mt-2">
          <li>Provide and improve our services</li>
          <li>Process transactions and payments</li>
          <li>Respond to inquiries and customer service requests</li>
          <li>Send updates, promotions, and service notifications</li>
          <li>Enhance security and prevent fraudulent activities</li>
          <li>Analyze usage patterns to improve our platform</li>
        </ul>
      </Section>

      <Section title="3. How We Share Your Information">
        We do not sell or rent your personal data. However, we may share it with:
        <ul className="list-disc list-inside mt-2">
          <li><strong>Service Providers:</strong> Third-party partners who assist in delivering services (e.g., payment processors, delivery partners).</li>
          <li><strong>Legal Authorities:</strong> If required by law, regulation, or to protect our rights and users.</li>
          <li><strong>Business Transfers:</strong> In case of a merger, acquisition, or business restructuring.</li>
        </ul>
      </Section>

      <Section title="4. Data Security">
        We implement industry-standard security measures to protect your data. However, no online platform is 100% secure. We recommend using strong passwords and safeguarding your account credentials.
      </Section>

      <Section title="5. Cookies & Tracking Technologies">
        We use cookies and similar technologies to:
        <ul className="list-disc list-inside mt-2">
          <li>Remember user preferences</li>
          <li>Analyze site traffic</li>
          <li>Improve user experience</li>
        </ul>
        You can disable cookies through your browser settings, but some features may not function properly.
      </Section>

      <Section title="6. Your Rights & Choices">
        Depending on your location, you may have the right to:
        <ul className="list-disc list-inside mt-2">
          <li>Access, update, or delete your personal data</li>
          <li>Opt-out of marketing communications</li>
          <li>Request data portability</li>
          <li>Restrict data processing in certain cases</li>
        </ul>
        To exercise your rights, contact us at <strong>info@seeb.in</strong>.
      </Section>

      <Section title="7. Third-Party Links & Services">
        Our platform may contain links to third-party sites. We are not responsible for their privacy practices, and we encourage you to read their policies before interacting with them.
      </Section>

      <Section title="8. Children's Privacy">
        Our services are not intended for children under 13. We do not knowingly collect personal data from minors. If we discover such data, we will delete it immediately.
      </Section>

      <Section title="9. Changes to This Policy">
        We may update this policy periodically. Any changes will be posted on this page, and we encourage you to review it regularly.
      </Section>

      <Section title="10. Contact Us">
        For any questions or concerns about this Privacy Policy, contact us at <strong>info@seeb.in</strong>.
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="text-sm leading-relaxed text-gray-700">{children}</div>
  </div>
);
 
const SubSection = ({ title, children }) => (
    <div className="mb-4 ml-4">
      <h3 className="text-md font-semibold mt-3 text-gray-800">{title}</h3>
      <div className="text-sm leading-relaxed text-gray-700">{children}</div>
    </div>
  );
  

export default Privacy;
