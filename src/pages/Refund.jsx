import React from "react";

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
    <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
  </div>
);

const Refund = () => {
  return (
    <div className="mx-auto px-8 sm:px-24 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          🔄 Seeb Services Cancellation Policy
        </h1>
        <p className="text-sm text-gray-600 mt-1">Last Updated: 01/03/2025</p>
      </div>

      {/* Policy Sections */}
      <Section title="1. Cancellation Before Service Initiation">
        <ul className="list-disc list-inside space-y-1">
          <li>If you cancel within 10 hours of booking and no team has been assigned, you receive a full refund.</li>
          <li>If a team has been assigned but work has not begun, a cancellation fee may apply.</li>
        </ul>
      </Section>

      <Section title="2. Cancellation After Service Has Started">
        <ul className="list-disc list-inside space-y-1">
          <li>Cancellations are not permitted once execution begins.</li>
          <li>No refunds if site work has started, materials are purchased, or customized items are processed.</li>
          <li>You are responsible for material and labor costs incurred.</li>
        </ul>
      </Section>

      <Section title="3. Cancellation by Seeb">
        <ul className="list-disc list-inside space-y-1">
          <li>Seeb reserves the right to cancel due to unavailability, force majeure, or violation of terms.</li>
          <li>If Seeb cancels, you receive a full refund or an alternative service option.</li>
        </ul>
      </Section>

      <Section title="4. Refund Policy">
        <ul className="list-disc list-inside space-y-1">
          <li>Full refunds are only for cancellations within 10 hours if no team is assigned.</li>
          <li>Refunds take 7-14 business days via the original payment method.</li>
          <li>Non-refundable fees (e.g., consultation/design) are communicated upfront.</li>
        </ul>
      </Section>

      <Section title="5. Service Modifications">
        <p>To modify a service, contact us at least [X] days in advance. Additional costs may apply.</p>
      </Section>

      <Section title="6. Contact for Cancellations">
        <p>To cancel or modify a service, please reach out to our support team.</p>
      </Section>
    </div>
  );
};

export default Refund;
