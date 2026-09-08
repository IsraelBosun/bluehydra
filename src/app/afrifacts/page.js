import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import AfrifactsClient from './AfrifactsClient';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-af-display',
  display: 'swap',
});

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-af-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://bluehydralabs.com'),
  title: 'Test AfriFacts: a verified fact about Africa, every day',
  description:
    'Join the AfriFacts closed test on Android. Drop your email and we\'ll send you the Play Store invite.',
  openGraph: {
    title: 'Be one of the first to test AfriFacts',
    description:
      'A verified fact about Africa, every single day. Join the closed Android test.',
    images: ['/images/afrifacts/og.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Be one of the first to test AfriFacts',
    description:
      'A verified fact about Africa, every single day. Join the closed Android test.',
    images: ['/images/afrifacts/og.png'],
  },
};

export default async function AfrifactsPage({ searchParams }) {
  const params = await searchParams;
  const source = typeof params?.s === 'string' ? params.s : null;

  return (
    <div className={`${display.variable} ${body.variable} af-body`}>
      <AfrifactsClient source={source} />
    </div>
  );
}
