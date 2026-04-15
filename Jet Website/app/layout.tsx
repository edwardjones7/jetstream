import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import LenisProvider from '@/components/LenisProvider';
import AtmosphereBackdrop from '@/components/AtmosphereBackdrop';
import HUD from '@/components/hud/HUD';
import ChapterNav from '@/components/hud/ChapterNav';
import Preloader from '@/components/Preloader';
import './globals.css';

const display = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OWN THE SKY',
  description: 'A cinematic flight. Scroll to ignite.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <Preloader />
        <AtmosphereBackdrop />
        <LenisProvider>{children}</LenisProvider>
        <HUD />
        <ChapterNav />
      </body>
    </html>
  );
}
