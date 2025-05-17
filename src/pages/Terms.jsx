import React from "react";

const Terms = () => {
  return (
    <div className=" mx-auto px-8 sm:px-24 py-8 text-gray-800 ">
      <h1 className="text-xl sm:text-3xl font-bold mb-2">📜 Seeb - Terms & Conditions</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: 01/03/2025</p>

      <Section title="1. Definitions">
        • “Seeb” refers to the company providing interior design, execution, and related services.<br />
        • “User” or “Client” refers to any person or entity using our services.<br />
        • “Service” includes all offerings by Seeb, such as AI-generated designs, execution, furniture, and custom interiors.
      </Section>

      <Section title="2. Service Agreement">
        • Our services are based on project scope, design requirements, and execution feasibility.<br />
        • A project will begin only after final approval and payment confirmation from the client.<br />
        • Changes to the project scope may result in additional charges and an extended timeline.
      </Section>

      <Section title="3. Pricing & Payments">
        • Prices are based on the chosen service and will be communicated before confirmation.<br />
        • Full or partial payment is required to confirm a booking. Payment schedules will be outlined in the agreement.<br />
        • All payments must be made via approved methods (bank transfer, UPI, credit/debit card, etc.).<br />
        • Taxes, if applicable, will be added to the final amount.
      </Section>

      <Section title="4. Cancellation & Refunds">
        • Refer to our Cancellation Policy for details. Key points include:<br />
        • Cancellations within 10 hours (if no team is assigned) are eligible for a full refund.<br />
        • Once execution has started or materials are purchased, cancellations are not allowed, and no refunds will be provided.<br />
        • Seeb reserves the right to cancel a service due to unforeseen circumstances, with a full refund issued.
      </Section>

      <Section title="5. User Responsibilities">
        • Users must provide accurate information regarding design preferences, space dimensions, and other details.<br />
        • Any delays caused by the user may affect the project timeline and cost.<br />
        • Clients must ensure that work areas are accessible and safe for our execution team.
      </Section>

      <Section title="6. Warranty & Liability">
        • Seeb provides a [X]-year warranty on specific services and products.<br />
        • We are not liable for damages caused by improper use, third-party modifications, or external factors.<br />
        • Any post-installation service requests will be handled as per the service agreement and may be chargeable.
      </Section>

      <Section title="7. Intellectual Property Rights">
        • All AI-generated designs, custom interior plans, and project documents remain the property of Seeb.<br />
        • Users may not reproduce, distribute, or modify Seeb’s designs without permission.
      </Section>

      <Section title="8. Privacy & Data Protection">
        • User data is collected and processed as per our Privacy Policy.<br />
        • We do not sell or share personal information except as necessary for service execution.
      </Section>

      <Section title="9. Dispute Resolution">
        • In case of a dispute, we encourage clients to contact us first for resolution.<br />
        • Any legal disputes will be handled under the jurisdiction of Pune, Maharashtra, India.
      </Section>

      <Section title="10. Amendments & Updates">
        • Seeb reserves the right to update these terms at any time.<br />
        • Users will be notified of major changes. Continued use of our services after updates indicates acceptance.
      </Section>

      <Section title="11. Contact Information">
        • For any questions regarding these Terms & Conditions, please contact us.
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-sm leading-relaxed text-gray-700">{children}</p>
  </div>
);

export default Terms;
