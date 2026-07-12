import "./globals.css";
import MetaPixel from '@/components/MetaPixel';

export const metadata = {
  title: 'Bluehydra Labs - Engineering Excellence, Delivered',
  description: 'We build high-performance web and mobile applications that scale with your business. Custom software development for modern companies.',
  keywords: 'web development, mobile app development, custom software, software engineering, web applications, mobile applications',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}