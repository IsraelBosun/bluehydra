import { Suspense } from 'react';
import PricingClient from './PricingClient';

export const metadata = {
  title: 'Pricing | Bluehydra Labs',
  description: 'Transparent pricing for websites, e-commerce, and custom software. From ₦300,000.',
};

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingClient />
    </Suspense>
  );
}
